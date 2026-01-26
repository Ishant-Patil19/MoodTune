# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Code Preparation
- [x] Backend CORS updated to use environment variables
- [x] Flask app configured for production (Gunicorn)
- [x] Gunicorn added to requirements.txt
- [x] Procfile created for Railway
- [x] Spotify redirect URI uses environment variable
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub/GitLab

### Environment Variables Ready
- [ ] `SECRET_KEY` - Generate a strong random key
- [ ] `JWT_SECRET_KEY` - Generate a strong random key
- [ ] `SPOTIFY_CLIENT_ID` - From Spotify Developer Dashboard
- [ ] `SPOTIFY_CLIENT_SECRET` - From Spotify Developer Dashboard
- [ ] `SPOTIFY_REDIRECT_URI` - Will be your production backend URL + `/spotify/callback`
- [ ] `FRONTEND_URL` - Your production frontend URL
- [ ] `DATABASE_URL` - SQLite for now (or PostgreSQL for production)

### Spotify Configuration
- [ ] Spotify app created in Developer Dashboard
- [ ] Redirect URI added: `https://your-backend-url/spotify/callback`
- [ ] Client ID and Secret copied

## Deployment Steps

### Backend Deployment
- [ ] Choose platform (Railway/Render)
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add all environment variables
- [ ] Deploy and get backend URL
- [ ] Test backend health endpoint
- [ ] Update Spotify redirect URI with production URL

### Frontend Deployment
- [ ] Choose platform (Vercel/Render)
- [ ] Connect GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deploy and get frontend URL
- [ ] Update backend `FRONTEND_URL` environment variable

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `https://your-backend-url/` returns success
- [ ] CORS working (no CORS errors in browser console)
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] Spotify OAuth flow works

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can link Spotify account
- [ ] Emotion detection works (if camera permissions granted)
- [ ] Music recommendations load
- [ ] Search functionality works

## Security Review

- [ ] All secret keys are strong and unique
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] CORS properly configured
- [ ] No sensitive data in code/logs
- [ ] Environment variables properly set

## Monitoring Setup

- [ ] Error logging configured
- [ ] Application monitoring enabled (if available)
- [ ] Database backups configured (if using PostgreSQL)

## Final Steps

- [ ] Update documentation with production URLs
- [ ] Test complete user flow end-to-end
- [ ] Share production URLs with team/users
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

---

## Quick Command Reference

### Generate Secret Keys (Python)
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Generate Secret Keys (Node.js)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Test Backend Locally with Production Settings
```bash
cd backend
export FLASK_ENV=production
export PORT=5000
gunicorn app:app --bind 0.0.0.0:5000
```

---

**Note**: Check the main DEPLOYMENT_GUIDE.md for detailed step-by-step instructions.
