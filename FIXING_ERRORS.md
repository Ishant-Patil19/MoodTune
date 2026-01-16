# Fixing Spotify and Face Recognition Errors

## Issues Fixed

### ✅ 1. FER Library Error (Face Recognition)
**Problem:** "Emotion detection service not available. FER library not installed."

**Solution:** 
- Installed TensorFlow 2.13.0 (required dependency for FER)
- FER library is now working correctly

**Status:** ✅ **FIXED** - Face recognition should now work!

---

### ⚠️ 2. Spotify Redirect URI Error
**Problem:** "Illegal redirect_uri" when connecting Spotify account

**Solution Required:**

1. **Create/Update `.env` file in the `backend` directory:**
   
   The `.env` file should contain:
   ```env
   DATABASE_URL=sqlite:///moodmusic.db
   SECRET_KEY=dev-secret-key-change-in-production
   JWT_SECRET_KEY=dev-jwt-secret-key-change-in-production
   SPOTIFY_CLIENT_ID=your-actual-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-actual-spotify-client-secret
   SPOTIFY_REDIRECT_URI=http://localhost:5000/spotify/callback
   ```

2. **Get Your Spotify Credentials:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account
   - Click "Create an app" or select your existing app
   - Copy the **Client ID** and **Client Secret**
   - Update the `.env` file with these values

3. **Configure Redirect URI in Spotify Dashboard:**
   - In your Spotify app settings, click "Edit Settings"
   - Scroll to "Redirect URIs"
   - Add exactly: `http://localhost:5000/spotify/callback`
   - **IMPORTANT:** 
     - No trailing slash
     - Must be exactly `http://localhost:5000/spotify/callback`
     - No extra spaces or characters
   - Click "Add" and then "Save"

4. **Restart Backend Server:**
   - Stop your backend server (Ctrl+C)
   - Start it again: `python app.py` (from the `backend` directory)

## Quick Setup Script

If you want to use the helper script to create the `.env` file:

```bash
cd backend
python create_env.py
```

This will prompt you for your Spotify credentials and create the `.env` file automatically.

## Verification

After setting up:

1. **Test Face Recognition:**
   - Try capturing your face again
   - The error should be gone and emotion detection should work

2. **Test Spotify Connection:**
   - Try connecting your Spotify account again
   - The "Illegal redirect_uri" error should be resolved

## Troubleshooting

### If Spotify still shows "Illegal redirect_uri":
- Double-check the redirect URI in Spotify Dashboard matches exactly: `http://localhost:5000/spotify/callback`
- Make sure there are no extra spaces or characters
- Verify your `.env` file has the correct `SPOTIFY_REDIRECT_URI` value
- Restart the backend server after updating `.env`

### If Face Recognition still doesn't work:
- Make sure the backend server is running
- Check the backend terminal for any error messages
- Try restarting the backend server

## Need Help?

If you're still experiencing issues:
1. Check the backend terminal output for error messages
2. Verify all environment variables are set correctly in `.env`
3. Make sure both frontend and backend servers are running




