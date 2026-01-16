# Spotify Setup Guide - Fix "INVALID_CLIENT" Error

## The Problem
You're seeing "INVALID_CLIENT: Invalid client" because your `.env` file still has placeholder values instead of your actual Spotify credentials.

## Step-by-Step Solution

### Step 1: Get Your Spotify Credentials

1. **Go to Spotify Developer Dashboard:**
   - Visit: https://developer.spotify.com/dashboard
   - Log in with your Spotify account

2. **Create or Select Your App:**
   - If you don't have an app, click **"Create an app"**
   - Fill in:
     - **App name:** (e.g., "MoodTune")
     - **App description:** (e.g., "Mood-based music recommendation")
     - **Website:** (optional, can be `http://localhost:3000`)
     - **Redirect URI:** `http://localhost:5000/spotify/callback` ⚠️ **IMPORTANT!**
     - **What API/SDKs are you planning to use?** Select: "Web API"
   - Check the agreement box
   - Click **"Save"**

3. **Copy Your Credentials:**
   - After creating the app, you'll see:
     - **Client ID** (a long string like `abc123def456...`)
     - **Client Secret** (click "Show client secret" to reveal it)
   - **Copy both of these values** - you'll need them in the next step

### Step 2: Update Your `.env` File

1. **Open the `.env` file:**
   - Location: `backend/.env`
   - You can open it with any text editor (Notepad, VS Code, etc.)

2. **Replace the placeholder values:**
   
   Find these lines:
   ```env
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   ```
   
   Replace them with your actual credentials:
   ```env
   SPOTIFY_CLIENT_ID=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
   SPOTIFY_CLIENT_SECRET=xyz987wvu654tsr321qpo098nml765kji432hgf210edc
   ```
   
   ⚠️ **Important:**
   - No quotes around the values
   - No spaces before or after the `=` sign
   - Use the exact values from Spotify Dashboard

3. **Verify your `.env` file looks like this:**
   ```env
   DATABASE_URL=sqlite:///moodmusic.db
   SECRET_KEY=dev-secret-key-change-in-production
   JWT_SECRET_KEY=dev-jwt-secret-key-change-in-production
   SPOTIFY_CLIENT_ID=your-actual-client-id-here
   SPOTIFY_CLIENT_SECRET=your-actual-client-secret-here
   SPOTIFY_REDIRECT_URI=http://localhost:5000/spotify/callback
   ```

### Step 3: Verify Redirect URI in Spotify Dashboard

1. **Go back to Spotify Developer Dashboard**
2. **Click on your app** → **"Edit Settings"**
3. **Scroll to "Redirect URIs"**
4. **Make sure this is added exactly:**
   ```
   http://localhost:5000/spotify/callback
   ```
   - No trailing slash
   - No `https://` (use `http://`)
   - Must match exactly what's in your `.env` file
5. **Click "Add"** then **"Save"**

### Step 4: Restart Your Backend Server

⚠️ **CRITICAL:** The backend server must be restarted to load the new `.env` values!

1. **Stop the backend server:**
   - Go to the terminal where it's running
   - Press `Ctrl+C` to stop it

2. **Start it again:**
   ```bash
   cd backend
   python app.py
   ```

3. **Verify it started correctly:**
   - You should see: `Running on http://127.0.0.1:5000`
   - No error messages about missing credentials

### Step 5: Test the Connection

1. **Go to your frontend** (http://localhost:3000)
2. **Try connecting your Spotify account again**
3. **The error should be gone!**

## Troubleshooting

### Still getting "INVALID_CLIENT"?

1. **Double-check your credentials:**
   - Make sure you copied the entire Client ID and Client Secret
   - No extra spaces or characters
   - Values are on the right side of the `=` sign

2. **Verify the backend loaded the credentials:**
   - Check the backend terminal when it starts
   - It should not show any errors about missing Spotify credentials

3. **Check for typos:**
   - Compare your `.env` file values with what's in Spotify Dashboard
   - Make sure they match exactly

4. **Try regenerating credentials:**
   - In Spotify Dashboard, click "Show client secret" again
   - Copy the secret again (it might have changed)
   - Update your `.env` file
   - Restart the backend

### Still getting "Illegal redirect_uri"?

- Make sure the redirect URI in Spotify Dashboard matches exactly: `http://localhost:5000/spotify/callback`
- No trailing slash, no extra spaces
- Make sure it's `http://` not `https://`

## Quick Checklist

- [ ] Created app in Spotify Developer Dashboard
- [ ] Copied Client ID and Client Secret
- [ ] Updated `.env` file with real credentials (not placeholders)
- [ ] Added redirect URI in Spotify Dashboard: `http://localhost:5000/spotify/callback`
- [ ] Restarted backend server after updating `.env`
- [ ] Backend server is running without errors
- [ ] Tried connecting Spotify account again

If you've completed all these steps and still have issues, check the backend terminal for detailed error messages.




