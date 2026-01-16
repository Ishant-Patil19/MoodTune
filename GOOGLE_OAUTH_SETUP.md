# Google OAuth Implementation Guide for MoodTune

## Overview
This guide explains how to implement Google OAuth authentication in MoodTune, allowing users to sign in with their Google accounts.

## Backend Setup

### 1. Environment Variables
Add these to your `.env` file in the `backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **Google People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Set application type to **Web application**
7. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
   - `http://localhost:3000` (for frontend)
8. Copy the **Client ID** and **Client Secret** to your `.env` file

### 3. Database Migration
The User model has been updated with Google OAuth fields. Run this migration:

```python
from app import app, db

with app.app_context():
    db.create_all()
    print("✅ Database tables created/updated successfully!")
```

## Backend API Endpoints

### POST /auth/google
Authenticates user with Google OAuth token and returns JWT token.

**Request Body:**
```json
{
  "token": "google-id-token-from-frontend"
}
```

**Response:**
```json
{
  "token": "jwt-access-token",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "https://...",
    "googleLinked": true
  }
}
```

## Frontend Implementation

### 1. Install Google OAuth Library
```bash
cd frontend
npm install @react-oauth/google
```

### 2. Setup Google OAuth Provider
Wrap your app with GoogleOAuthProvider in `app/layout.tsx` or `_app.tsx`:

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### 3. Gmail Account Selector Component
The `GmailAccountSelector` component uses Google's One Tap sign-in to show available Google accounts.

## How It Works

1. **User clicks "Continue with Google"** → Opens Gmail account selector popup
2. **Google One Tap shows available accounts** → User selects an account
3. **Frontend receives Google ID token** → Sends to backend `/auth/google`
4. **Backend verifies token** → Creates/updates user in database
5. **Backend returns JWT token** → Frontend stores token and redirects to home
6. **User profile populated** → Name, email, picture from Google account

## Security Notes

- Google ID tokens are verified on the backend using Google's official library
- Tokens expire after 1 hour and are automatically refreshed
- User data is stored securely in the database
- CORS is configured to only allow requests from localhost:3000

## Testing

1. Start the backend: `python app.py`
2. Start the frontend: `npm run dev`
3. Navigate to `/signup`
4. Click "Google" button
5. Select a Google account from the popup
6. You should be redirected to the home page, logged in

## Production Deployment

Before deploying to production:

1. Update `GOOGLE_REDIRECT_URI` in `.env` to your production URL
2. Add production URL to Google Cloud Console authorized redirect URIs
3. Update CORS settings in `app.py` to include production domain
4. Use HTTPS for all OAuth redirects
5. Store sensitive credentials in environment variables, not in code

## Troubleshooting

**"Invalid token" error:**
- Check that GOOGLE_CLIENT_ID matches in frontend and backend
- Verify token hasn't expired
- Ensure Google+ API is enabled

**"Redirect URI mismatch":**
- Check that redirect URI in Google Console matches exactly
- Include http:// or https:// prefix
- No trailing slashes

**"User already exists":**
- Email is already registered with password
- User can link Google account from settings page
