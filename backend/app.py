import requests
import urllib.parse
import json
import base64
import numpy as np
from io import BytesIO
from PIL import Image
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import BadRequest, Unauthorized, Forbidden, NotFound, MethodNotAllowed, Conflict
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from config import Config
from models import db, User, EmotionLog, VoiceCommandLog, GestureLog, Playlist, PlaylistSong, LikedSong, SongHistory
from utils.spotify import get_playlist_for_emotion

# Try to import FER for emotion detection (optional - will fallback if not available)
try:
    from fer import FER
    fer_detector = FER(mtcnn=True)
    FER_AVAILABLE = True
except ImportError:
    FER_AVAILABLE = False
    print("⚠️ FER library not available. Emotion detection from images will be limited.")

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
db.init_app(app)
jwt = JWTManager(app)

# ======================================================
# 0️⃣  Health Check
# ======================================================
@app.route('/')
def home():
    return jsonify({"message": "Mood-Based Music API is live!"}), 200


# ======================================================
# 1️⃣  Authentication & User Management
# ======================================================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = generate_password_hash(data["password"])
    new_user = User(email=data["email"], password=hashed_pw, consent_given=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token}), 200


@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_me():
    """Return user profile info + Spotify connection status"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "spotifyLinked": bool(user.spotify_access_token),
        "spotifyUser": {
            "id": user.spotify_id,
            "name": user.spotify_display_name,
            "email": user.spotify_email
        } if user.spotify_access_token else None
    }), 200


# ======================================================
# 2️⃣  Spotify Integration
# ======================================================
def ensure_valid_spotify_token(user):
    """Auto-refresh Spotify access token if expired"""
    test_resp = requests.get(
        "https://api.spotify.com/v1/me",
        headers={"Authorization": f"Bearer {user.spotify_access_token}"}
    )
    if test_resp.status_code == 401:
        token_url = "https://accounts.spotify.com/api/token"
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": user.spotify_refresh_token,
            "client_id": app.config["SPOTIFY_CLIENT_ID"],
            "client_secret": app.config["SPOTIFY_CLIENT_SECRET"]
        }
        response = requests.post(token_url, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
        token_data = response.json()
        new_access_token = token_data.get("access_token")
        if new_access_token:
            user.spotify_access_token = new_access_token
            db.session.commit()
            print("🔄 Spotify access token refreshed successfully.")


@app.route('/api/spotify/login-url', methods=['GET'])
@jwt_required()
def get_spotify_login_url():
    """Get Spotify OAuth login URL - returns JSON with URL"""
    user_id = get_jwt_identity()
    auth_url = "https://accounts.spotify.com/authorize"
    params = {
        "client_id": app.config["SPOTIFY_CLIENT_ID"],
        "response_type": "code",
        "redirect_uri": app.config["SPOTIFY_REDIRECT_URI"],
        "scope": "user-read-email playlist-read-private",
        "show_dialog": "true",
        "state": str(user_id)  # Pass user_id in state for verification
    }
    query_string = urllib.parse.urlencode(params)
    spotify_url = f"{auth_url}?{query_string}"
    return jsonify({"url": spotify_url}), 200


@app.route('/spotify/login')
@jwt_required()
def spotify_login():
    """Initiate Spotify OAuth flow - redirects to Spotify (for direct browser access)"""
    user_id = get_jwt_identity()
    auth_url = "https://accounts.spotify.com/authorize"
    params = {
        "client_id": app.config["SPOTIFY_CLIENT_ID"],
        "response_type": "code",
        "redirect_uri": app.config["SPOTIFY_REDIRECT_URI"],
        "scope": "user-read-email playlist-read-private",
        "show_dialog": "true",
        "state": str(user_id)  # Pass user_id in state for verification
    }
    query_string = urllib.parse.urlencode(params)
    return redirect(f"{auth_url}?{query_string}")


@app.route('/spotify/callback')
def spotify_callback():
    """Handle Spotify OAuth callback - redirects to frontend with code"""
    code = request.args.get("code")
    state = request.args.get("state")  # Contains user_id
    
    if not code:
        return jsonify({"error": "Missing code in callback"}), 400

    # Redirect to frontend with the code - frontend will handle the connection
    return redirect(f"http://localhost:3000?spotify_code={code}")


@app.route('/spotify/callback/complete', methods=['POST'])
@jwt_required()
def spotify_callback_complete():
    """Complete Spotify OAuth connection - called from callback HTML page"""
    user_id = get_jwt_identity()
    data = request.get_json()
    code = data.get("code")
    
    if not code:
        return jsonify({"error": "Missing code"}), 400

    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": app.config["SPOTIFY_REDIRECT_URI"],
        "client_id": app.config["SPOTIFY_CLIENT_ID"],
        "client_secret": app.config["SPOTIFY_CLIENT_SECRET"]
    }
    response = requests.post(token_url, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token_data = response.json()

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    if not access_token:
        return jsonify({"error": "Failed to get access token", "details": token_data}), 400

    # Fetch Spotify user profile
    user_info = requests.get("https://api.spotify.com/v1/me",
                             headers={"Authorization": f"Bearer {access_token}"}).json()

    user = User.query.get(int(user_id))
    user.spotify_id = user_info.get("id")
    user.spotify_display_name = user_info.get("display_name")
    user.spotify_email = user_info.get("email")
    user.spotify_access_token = access_token
    user.spotify_refresh_token = refresh_token
    db.session.commit()

    return jsonify({
        "message": "Spotify account linked successfully",
        "spotify_user": {
            "id": user.spotify_id,
            "name": user.spotify_display_name,
            "email": user.spotify_email
        }
    }), 200


@app.route('/spotify/refresh_token', methods=['POST'])
@jwt_required()
def refresh_spotify_token():
    """Refresh Spotify access token using stored refresh_token"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    refresh_token = getattr(user, "spotify_refresh_token", None)
    if not refresh_token:
        return jsonify({"error": "No refresh token found"}), 400

    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": app.config["SPOTIFY_CLIENT_ID"],
        "client_secret": app.config["SPOTIFY_CLIENT_SECRET"]
    }
    response = requests.post(token_url, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token_data = response.json()

    new_access_token = token_data.get("access_token")
    if not new_access_token:
        return jsonify({"error": "Failed to refresh token"}), 400

    user.spotify_access_token = new_access_token
    db.session.commit()
    return jsonify({"message": "Spotify token refreshed successfully"}), 200


# ======================================================
# 3️⃣  Emotion Detection & Recommendations
# ======================================================
@app.route('/log_emotion', methods=['POST'])
@jwt_required()
def log_emotion_post():
    """Store detected emotion from emotion_detector.py"""
    user_id = get_jwt_identity()
    data = request.get_json()
    emotion = data.get("emotion")
    if not emotion:
        return jsonify({"error": "Emotion field required"}), 400

    db.session.add(EmotionLog(user_id=user_id, emotion=emotion))
    db.session.commit()

    return jsonify({"message": f"Logged emotion: {emotion}"}), 200


@app.route('/api/detect-emotion', methods=['POST'])
@jwt_required()
def detect_emotion_from_image():
    """Detect emotion from base64 encoded image"""
    if not FER_AVAILABLE:
        return jsonify({"error": "Emotion detection service not available. FER library not installed."}), 503
    
    try:
        data = request.get_json()
        image_data = data.get("image")
        
        if not image_data:
            return jsonify({"error": "Image data required"}), 400
        
        # Remove data URL prefix if present (e.g., "data:image/jpeg;base64,...")
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert PIL Image to numpy array (RGB)
        image_array = np.array(image)
        
        # Convert RGB to BGR for OpenCV/FER
        if len(image_array.shape) == 3 and image_array.shape[2] == 3:
            image_bgr = image_array[:, :, ::-1]  # RGB to BGR
        else:
            image_bgr = image_array
        
        # Detect emotions
        emotions = fer_detector.detect_emotions(image_bgr)
        
        if not emotions or len(emotions) == 0:
            return jsonify({
                "emotion": None,
                "confidence": 0,
                "message": "No face detected in the image"
            }), 200
        
        # Get the first face's top emotion
        face = emotions[0]
        emotion_scores = face.get("emotions", {})
        
        if not emotion_scores:
            return jsonify({
                "emotion": None,
                "confidence": 0,
                "message": "Could not detect emotions"
            }), 200
        
        # Find the emotion with highest score
        top_emotion = max(emotion_scores, key=emotion_scores.get)
        confidence = emotion_scores[top_emotion]
        
        return jsonify({
            "emotion": top_emotion,
            "confidence": round(confidence, 2),
            "all_emotions": emotion_scores
        }), 200
        
    except Exception as e:
        print(f"Error detecting emotion: {str(e)}")
        return jsonify({"error": f"Failed to detect emotion: {str(e)}"}), 500


@app.route('/api/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Emotion-based music recommendations (Spotify / JioSaavn + Well-being mode)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    emotion = request.args.get("emotion")
    language = request.args.get("language")
    wellbeing_mode = request.args.get("wellbeing", "false").lower() == "true"

    if not emotion:
        last_log = EmotionLog.query.filter_by(user_id=user_id).order_by(EmotionLog.timestamp.desc()).first()
        if not last_log:
            return jsonify({"error": "No emotion detected yet"}), 404
        emotion = last_log.emotion

    if not language:
        return jsonify({
            "message": "Please select a language to continue.",
            "available_languages": ["Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil"]
        }), 200

    # 🌿 Mental well-being mapping
    MENTAL_WELLBEING_MAP = {
        "sad": "motivational",
        "depressed": "healing",
        "angry": "calm",
        "stressed": "relaxing",
        "fear": "courage",
        "anxious": "soothing"
    }
    query_emotion = MENTAL_WELLBEING_MAP.get(emotion.lower(), emotion) if wellbeing_mode else emotion
    query = f"{query_emotion} {language}"

    # ✅ Spotify path
    if user and user.spotify_access_token:
        ensure_valid_spotify_token(user)
        spotify_resp = requests.get(
            f"https://api.spotify.com/v1/search?q={urllib.parse.quote(query)}&type=track&limit=10",
            headers={"Authorization": f"Bearer {user.spotify_access_token}"}
        )
        if spotify_resp.status_code == 200:
            tracks = spotify_resp.json().get("tracks", {}).get("items", [])
            return jsonify([
                {
                    "title": t.get("name"),
                    "artist": ", ".join([a["name"] for a in t.get("artists", [])]),
                    "album": t.get("album", {}).get("name"),
                    "spotifyUri": t.get("uri"),
                    "source": "Spotify",
                    "emotion": query_emotion,
                    "language": language,
                    "wellbeing_mode": wellbeing_mode
                } for t in tracks
            ]), 200

    # 🧠 JioSaavn fallback
    saavn_resp = requests.get(f"https://saavn.dev/api/search/songs?query={urllib.parse.quote(query)}&limit=10")
    if saavn_resp.status_code != 200:
        return jsonify({"error": "Failed to fetch recommendations"}), 502

    saavn_data = saavn_resp.json().get("data", [])
    results = [
        {
            "title": s.get("name"),
            "artist": ", ".join(a["name"] for a in s.get("artists", [])),
            "album": s.get("album", {}).get("name"),
            "url": s.get("url"),
            "language": language,
            "emotion": query_emotion,
            "source": "JioSaavn",
            "wellbeing_mode": wellbeing_mode
        } for s in saavn_data
    ]
    return jsonify(results), 200


@app.route('/api/search', methods=['GET'])
@jwt_required()
def search_music():
    """Unified music search (Spotify or JioSaavn fallback)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    query = request.args.get("q")
    search_type = request.args.get("type", "track")

    if not query:
        return jsonify({"error": "Missing search query"}), 400

    # Spotify path
    if user and user.spotify_access_token:
        ensure_valid_spotify_token(user)
        resp = requests.get(
            f"https://api.spotify.com/v1/search?q={urllib.parse.quote(query)}&type={search_type}&limit=10",
            headers={"Authorization": f"Bearer {user.spotify_access_token}"}
        )
        if resp.status_code == 200:
            data = resp.json()
            return jsonify([
                {
                    "title": t.get("name"),
                    "artist": ", ".join([a["name"] for a in t.get("artists", [])]),
                    "album": t.get("album", {}).get("name"),
                    "spotifyUri": t.get("uri"),
                    "source": "Spotify"
                } for t in data.get("tracks", {}).get("items", [])
            ]), 200

    # JioSaavn fallback
    resp = requests.get(f"https://saavn.dev/api/search/songs?query={urllib.parse.quote(query)}&limit=10")
    data = resp.json().get("data", [])
    return jsonify([
        {
            "title": s.get("name"),
            "artist": ", ".join(a["name"] for a in s.get("artists", [])),
            "album": s.get("album", {}).get("name"),
            "url": s.get("url"),
            "source": "JioSaavn"
        } for s in data
    ]), 200

# =========================================
# Liked / Unliked songs & history endpoints
# =========================================

@app.route('/api/songs/like', methods=['POST'])
@jwt_required()
def like_song():
    """
    Body JSON:
    {
      "source": "spotify" | "jiosaavn",
      "external_id": "spotify:track:abc" or "<jiosaavn-url-or-id>",
      "title": "...",
      "artist": "...",
      "album": "..."
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    source = data.get("source")
    external_id = data.get("external_id")
    title = data.get("title")
    artist = data.get("artist")
    album = data.get("album")

    if not source or not external_id or not title:
        return jsonify({"error": "source, external_id and title are required"}), 400

    # Check duplicate via unique constraint
    existing = LikedSong.query.filter_by(user_id=user_id, source=source, external_id=external_id).first()
    if existing:
        return jsonify({"message": "Song already liked"}), 200

    liked = LikedSong(
        user_id=user_id,
        source=source,
        external_id=external_id,
        title=title,
        artist=artist,
        album=album
    )
    db.session.add(liked)
    db.session.commit()
    return jsonify({"message": "Song liked successfully"}), 201

@app.route('/api/songs/like', methods=['DELETE'])
@jwt_required()
def unlike_song():
    """
    Body JSON:
    {
      "source": "spotify" | "jiosaavn",
      "external_id": "..."
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    source = data.get("source")
    external_id = data.get("external_id")
    if not source or not external_id:
        return jsonify({"error": "source and external_id are required"}), 400

    existing = LikedSong.query.filter_by(user_id=user_id, source=source, external_id=external_id).first()
    if not existing:
        return jsonify({"error": "Song not found in liked songs"}), 404

    db.session.delete(existing)
    db.session.commit()
    return jsonify({"message": "Song unliked successfully"}), 200

@app.route('/api/liked-songs', methods=['GET'])
@jwt_required()
def get_liked_songs():
    user_id = get_jwt_identity()
    liked = LikedSong.query.filter_by(user_id=user_id).all()
    results = [
        {
            "source": s.source,
            "external_id": s.external_id,
            "title": s.title,
            "artist": s.artist,
            "album": s.album
        } for s in liked
    ]
    return jsonify(results), 200

@app.route('/api/song-history', methods=['GET'])
@jwt_required()
def get_song_history():
    user_id = get_jwt_identity()
    history = SongHistory.query.filter_by(user_id=user_id).all()
    results = [
        {
            "source": h.source,
            "external_id": h.external_id,
            "title": h.title,
            "artist": h.artist,
            "album": h.album
        } for h in history
    ]
    return jsonify(results), 200


# ======================================================
# 4️⃣  Playlist Management
# ======================================================
@app.route('/api/playlists', methods=['GET'])
@jwt_required()
def get_all_playlists():
    user_id = get_jwt_identity()
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    return jsonify([
        {"playlistId": p.id, "name": p.name, "description": p.description, "createdAt": p.created_at.isoformat()}
        for p in playlists
    ]), 200


@app.route('/api/playlists', methods=['POST'])
@jwt_required()
def create_playlist():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Missing playlist name"}), 400

    playlist = Playlist(user_id=user_id, name=name, description=data.get("description", ""))
    db.session.add(playlist)
    db.session.commit()
    return jsonify({"message": "Playlist created", "playlistId": playlist.id}), 201


# ======================================================
# 5️⃣  Gestures & Voice Commands
# ======================================================
@app.route('/api/gestures/map', methods=['POST'])
@jwt_required()
def map_gesture_to_action():
    user_id = get_jwt_identity()
    data = request.get_json()
    gesture, action = data.get("gestureName"), data.get("action")
    if not gesture or not action:
        return jsonify({"error": "Invalid gesture name or action"}), 400
    db.session.add(GestureLog(user_id=user_id, gesture=f"{gesture}:{action}"))
    db.session.commit()
    return jsonify({"message": "Gesture mapped successfully"}), 200


@app.route('/api/voice/command', methods=['POST'])
@jwt_required()
def process_voice_command():
    user_id = get_jwt_identity()
    data = request.get_json()
    command = data.get("commandPhrase")
    if not command:
        return jsonify({"error": "Missing command phrase"}), 400

    phrase_to_action = {
        "play next song": "next_song",
        "play previous song": "previous_song",
        "pause song": "pause",
        "play song": "play"
    }
    action = phrase_to_action.get(command.lower())
    if not action:
        return jsonify({"error": "Unrecognized command"}), 400

    db.session.add(VoiceCommandLog(user_id=user_id, command=command))
    db.session.commit()
    return jsonify({"message": "Voice command processed", "actionExecuted": action}), 200


# ======================================================
# 6️⃣  Global Error Handlers
# ======================================================
@app.errorhandler(Exception)
def handle_500(e):
    return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


# ======================================================
# 7️⃣  Init DB
# ======================================================
with app.app_context():
    db.create_all()
    print("✅ Database initialized successfully!")

if __name__ == '__main__':
    app.run(debug=True)
