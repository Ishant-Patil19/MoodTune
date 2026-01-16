"""
Script to create .env file for MoodTune backend
Run this script to set up your environment variables
"""
import os

def create_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        response = input(f".env file already exists at {env_path}. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled. Existing .env file preserved.")
            return
    
    print("\n=== MoodTune Backend .env Setup ===\n")
    print("Please provide the following information:\n")
    
    # Get Spotify credentials
    spotify_client_id = input("Spotify Client ID (or press Enter to leave as placeholder): ").strip()
    if not spotify_client_id:
        spotify_client_id = "your-spotify-client-id"
    
    spotify_client_secret = input("Spotify Client Secret (or press Enter to leave as placeholder): ").strip()
    if not spotify_client_secret:
        spotify_client_secret = "your-spotify-client-secret"
    
    # Default values
    database_url = "sqlite:///moodmusic.db"
    secret_key = "dev-secret-key-change-in-production"
    jwt_secret_key = "dev-jwt-secret-key-change-in-production"
    redirect_uri = "http://localhost:5000/spotify/callback"
    
    # Create .env content
    env_content = f"""DATABASE_URL={database_url}
SECRET_KEY={secret_key}
JWT_SECRET_KEY={jwt_secret_key}
SPOTIFY_CLIENT_ID={spotify_client_id}
SPOTIFY_CLIENT_SECRET={spotify_client_secret}
SPOTIFY_REDIRECT_URI={redirect_uri}
"""
    
    # Write to file
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"\n✅ .env file created successfully at {env_path}")
    print("\n⚠️  IMPORTANT: Make sure to:")
    print("1. Add the redirect URI to your Spotify app settings:")
    print(f"   {redirect_uri}")
    print("2. Go to https://developer.spotify.com/dashboard")
    print("3. Click on your app → Edit Settings")
    print("4. Under 'Redirect URIs', add the URI above")
    print("5. Make sure there are NO trailing slashes or extra characters")
    print("\n6. Restart your backend server after updating .env file")

if __name__ == "__main__":
    create_env_file()




