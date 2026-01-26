# Final Fix: "$PORT is not a valid port number"

## The Problem

Railway isn't expanding `$PORT` in the Procfile or start command. This happens when Railway uses the command directly without shell expansion.

## ✅ Solution: Use Python Start Script

I've created a Python script (`start.py`) that reads the PORT environment variable properly. This works regardless of how Railway runs it.

### What Changed:

1. **Created `backend/start.py`**:
   - Reads PORT from environment
   - Validates it's a valid port number
   - Starts Gunicorn with the correct port

2. **Updated `backend/Procfile`**:
   - Changed from: `gunicorn --bind 0.0.0.0:$PORT ...`
   - Changed to: `python start.py`
   - This avoids shell variable expansion issues

### Next Steps:

1. **Commit and push**:
   ```bash
   git add backend/start.py backend/Procfile
   git commit -m "Use Python start script to handle PORT variable"
   git push
   ```

2. **In Railway Dashboard**:
   - Go to your service → **Settings** → **Build**
   - Make sure **Builder** is set to **"Nixpacks"** (NOT Dockerfile)
   - If it says "Dockerfile", change it to "Nixpacks"
   - This ensures Railway uses the Procfile

3. **Remove or rename Dockerfile** (optional but recommended):
   ```bash
   mv backend/Dockerfile backend/Dockerfile.backup
   git add backend/Dockerfile.backup
   git commit -m "Use Procfile instead of Dockerfile"
   git push
   ```
   
   This forces Railway to use Procfile instead of trying to use Dockerfile.

4. **Redeploy** - Should work now!

## Alternative: Set Start Command in Railway Settings

If the above doesn't work:

1. **In Railway Dashboard**:
   - Go to your service → **Settings** → **Deploy**
   - Find **"Start Command"** field
   - Set it to: `python start.py`
   - Save and redeploy

## Why This Works

- Python's `os.environ.get()` always reads environment variables correctly
- No shell expansion needed - Python handles it
- Works with both Procfile and manual start commands
- Validates the port number before starting

## Verify It's Working

After deployment:
1. Check Railway logs - should see Gunicorn starting
2. Visit: `https://your-backend-url.railway.app/`
3. Should see: `{"message": "Mood-Based Music API is live!"}`

---

**This solution should definitely work!** The Python script approach is more reliable than shell variable expansion in Railway.
