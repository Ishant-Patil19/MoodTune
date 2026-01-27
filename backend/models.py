import uuid
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128))  # If using JWT
    consent_given = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Profile fields
    first_name = db.Column(db.String(120))
    username = db.Column(db.String(120), unique=True)
    phone_number = db.Column(db.String(20))
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(500))

    # Preferences
    theme = db.Column(db.String(20), default='light')  # 'light' or 'dark'
    language = db.Column(db.String(50), default='English')
    camera_access_enabled = db.Column(db.Boolean, default=True)
    notifications_enabled = db.Column(db.Boolean, default=True)
    add_to_home_enabled = db.Column(db.Boolean, default=False)

    # Spotify fields
    spotify_id = db.Column(db.String(120), unique=True)
    spotify_display_name = db.Column(db.String(120))
    spotify_email = db.Column(db.String(120), unique=True)
    spotify_access_token = db.Column(db.Text)
    spotify_refresh_token = db.Column(db.Text)

    # Google fields
    google_id = db.Column(db.String(120), unique=True)
    google_email = db.Column(db.String(120))
    google_name = db.Column(db.String(120))
    google_access_token = db.Column(db.Text)
    google_refresh_token = db.Column(db.Text)

    emotions = db.relationship('EmotionLog', backref='user', lazy=True)
    voice_commands = db.relationship('VoiceCommandLog', backref='user', lazy=True)
    gestures = db.relationship('GestureLog', backref='user', lazy=True)

class EmotionLog(db.Model):
    __tablename__ = 'emotion_logs'  # ✅ Explicit name
    id = db.Column(db.Integer, primary_key=True)
    emotion = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class PlaylistMapping(db.Model):
    __tablename__ = 'playlist_mappings'  # ✅ Explicit name
    id = db.Column(db.Integer, primary_key=True)
    emotion = db.Column(db.String(50), unique=True, nullable=False)
    spotify_playlist_id = db.Column(db.String(100), nullable=False)

class VoiceCommandLog(db.Model):
    __tablename__ = 'voice_command_logs'  # ✅ Explicit name
    id = db.Column(db.Integer, primary_key=True)
    command = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class GestureLog(db.Model):
    __tablename__ = 'gesture_logs'  # ✅ Explicit name
    id = db.Column(db.Integer, primary_key=True)
    gesture = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(120), nullable=False)
    artist = db.Column(db.String(120), nullable=False)
    album = db.Column(db.String(120))
    genre = db.Column(db.String(50))
    duration = db.Column(db.Integer)  # Duration in seconds
    release_year = db.Column(db.Integer)
    spotify_uri = db.Column(db.String(120))
    emotion_tag = db.Column(db.String(20))  # e.g., "happy", "sad", "angry"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='playlists')
    songs = db.relationship('PlaylistSong', back_populates='playlist', cascade="all, delete")

class PlaylistSong(db.Model):
    __tablename__ = 'playlist_songs'
    playlist_id = db.Column(db.String, db.ForeignKey('playlists.id'), primary_key=True)
    song_id = db.Column(db.String, db.ForeignKey('songs.id'), primary_key=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    playlist = db.relationship('Playlist', back_populates='songs')
    song = db.relationship('Song')

    def to_dict(self):
        return {
            "songId": self.id,
            "title": self.title,
            "artist": self.artist,
            "album": self.album,
            "genre": self.genre,
            "duration": self.duration,
            "releaseYear": self.release_year,
            "spotifyUri": self.spotify_uri
        }

# -------------------------
# New: Liked songs & history
# -------------------------
class LikedSong(db.Model):
    __tablename__ = 'liked_songs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    source = db.Column(db.String(50), nullable=False)  # 'spotify' or 'jiosaavn'
    external_id = db.Column(db.String(255), nullable=False)  # spotify:track:... or jiosaavn url/id
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255))
    album = db.Column(db.String(255))

    # prevent duplicate likes for same user + external_id + source
    __table_args__ = (db.UniqueConstraint('user_id', 'source', 'external_id', name='uq_user_source_external'),)

class SongHistory(db.Model):
    __tablename__ = 'song_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    source = db.Column(db.String(50), nullable=False)  # 'spotify' or 'jiosaavn'
    external_id = db.Column(db.String(255))  # spotify uri or jiosaavn url
    title = db.Column(db.String(255))
    artist = db.Column(db.String(255))
    album = db.Column(db.String(255))
