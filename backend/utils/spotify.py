import requests
from flask import current_app
from base64 import b64encode

def get_spotify_token():
    try:
        client_id = current_app.config.get('SPOTIFY_CLIENT_ID')
        client_secret = current_app.config.get('SPOTIFY_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            print("⚠️ Spotify credentials not configured")
            return None
        
        auth_str = f"{client_id}:{client_secret}"
        b64_auth_str = b64encode(auth_str.encode()).decode()

        res = requests.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials"},
            headers={"Authorization": f"Basic {b64_auth_str}"}
        )
        
        if res.status_code == 200:
            return res.json().get("access_token")
        else:
            print(f"⚠️ Failed to get Spotify token: {res.status_code} - {res.text}")
            return None
    except Exception as e:
        print(f"⚠️ Error getting Spotify token: {str(e)}")
        return None


def get_playlist_for_emotion(emotion):
    emotion_to_playlist = {
        "happy": "1A9oCcZKDOGEaD6d1s3IVo",     # Replace with your actual playlist IDs
        "sad": "2BXJvFoKzqK8x94Jfmsdgs",
        "angry": "3KD2rxF7paQiM3jzYfVtyW",
        "neutral": "5PJNf84kDMsQasBfda893a",
        "surprise": "4MHU7Pg7Jykzjksdfasdfa",
        "calm": "6SKYBTRaqxHFlbkKEr5NY1"
    }
    return emotion_to_playlist.get(emotion.lower())

