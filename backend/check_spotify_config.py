"""
Script to check if Spotify credentials are configured correctly
Run this to verify your .env file setup before testing Spotify connection
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_spotify_config():
    print("=" * 60)
    print("Spotify Configuration Checker")
    print("=" * 60)
    print()
    
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")
    
    # Check Client ID
    print("1. SPOTIFY_CLIENT_ID:")
    if not client_id:
        print("   [X] NOT SET - Missing from .env file")
    elif client_id == "your-spotify-client-id":
        print("   [X] PLACEHOLDER VALUE - Still using default placeholder")
        print("   [!] You need to replace this with your actual Client ID from Spotify Dashboard")
    elif len(client_id) < 20:
        print(f"   [!] Value seems too short: {client_id[:10]}...")
        print("   [!] Spotify Client IDs are usually 32 characters long")
    else:
        print(f"   [OK] SET - {client_id[:10]}...{client_id[-4:]}")
    
    print()
    
    # Check Client Secret
    print("2. SPOTIFY_CLIENT_SECRET:")
    if not client_secret:
        print("   [X] NOT SET - Missing from .env file")
    elif client_secret == "your-spotify-client-secret":
        print("   [X] PLACEHOLDER VALUE - Still using default placeholder")
        print("   [!] You need to replace this with your actual Client Secret from Spotify Dashboard")
    elif len(client_secret) < 20:
        print(f"   [!] Value seems too short: {client_secret[:10]}...")
        print("   [!] Spotify Client Secrets are usually 32 characters long")
    else:
        print(f"   [OK] SET - {client_secret[:10]}...{client_secret[-4:]}")
    
    print()
    
    # Check Redirect URI
    print("3. SPOTIFY_REDIRECT_URI:")
    if not redirect_uri:
        print("   [X] NOT SET - Missing from .env file")
    elif redirect_uri != "http://localhost:5000/spotify/callback":
        print(f"   [!] Current value: {redirect_uri}")
        print("   [!] Expected: http://localhost:5000/spotify/callback")
        print("   [!] Make sure this matches exactly in Spotify Dashboard")
    else:
        print(f"   [OK] SET - {redirect_uri}")
    
    print()
    print("=" * 60)
    
    # Overall status
    if (client_id and client_id != "your-spotify-client-id" and 
        client_secret and client_secret != "your-spotify-client-secret" and
        redirect_uri == "http://localhost:5000/spotify/callback"):
        print("[OK] All Spotify credentials are configured correctly!")
        print()
        print("Next steps:")
        print("1. Make sure the redirect URI is added in Spotify Dashboard:")
        print("   https://developer.spotify.com/dashboard")
        print("2. Restart your backend server if you just updated .env")
        print("3. Try connecting your Spotify account again")
    else:
        print("[X] Configuration incomplete!")
        print()
        print("To fix:")
        print("1. Go to https://developer.spotify.com/dashboard")
        print("2. Create an app or select your existing app")
        print("3. Copy your Client ID and Client Secret")
        print("4. Update backend/.env file with these values")
        print("5. Make sure redirect URI is: http://localhost:5000/spotify/callback")
        print("6. Add the same redirect URI in Spotify Dashboard")
        print("7. Restart your backend server")
    
    print("=" * 60)

if __name__ == "__main__":
    check_spotify_config()

