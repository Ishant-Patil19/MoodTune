# How to Remove Dockerfile as Builder in Railway

## Method 1: Change Builder in Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**:
   - Open [railway.app](https://railway.app)
   - Click on your project
   - Click on your backend service

2. **Go to Settings**:
   - Click the **"Settings"** tab (top navigation)

3. **Change Builder**:
   - Scroll down to the **"Build"** section
   - Look for **"Builder"** or **"Build Command"** settings
   - If you see **"Dockerfile"** selected, change it to:
     - **"Nixpacks"** (automatic detection)
     - OR **"None"** (if available)
   - Click **"Save"**

4. **Redeploy**:
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** or push a new commit

## Method 2: Rename/Remove Dockerfile (Forces Procfile Usage)

If Method 1 doesn't work or you want to ensure Railway uses Procfile:

1. **Rename the Dockerfile**:
   ```bash
   cd backend
   mv Dockerfile Dockerfile.backup
   ```

2. **Commit the change**:
   ```bash
   git add backend/Dockerfile.backup
   git commit -m "Remove Dockerfile to use Procfile instead"
   git push
   ```

3. **Railway will automatically**:
   - Detect that there's no Dockerfile
   - Use your `Procfile` instead
   - Use Nixpacks for building

## Method 3: Add .railwayignore or railway.json

You can also tell Railway to ignore the Dockerfile:

1. **Create `backend/.railwayignore`**:
   ```
   Dockerfile
   Dockerfile.*
   ```

2. **OR create `backend/railway.json`**:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     }
   }
   ```

## Verify It's Working

After making changes:

1. **Check Railway Logs**:
   - Go to **Deployments** → Latest deployment → **View Logs**
   - Should see: "Detected Python" or "Using Nixpacks"
   - Should NOT see: "Building Dockerfile" or "Using Dockerfile"

2. **Check Build Process**:
   - Should see: "Detected Procfile" or "Using Procfile"
   - Should see: "web: python start.py" in logs

3. **Test the App**:
   - Visit: `https://your-backend-url.railway.app/`
   - Should see: `{"message": "Mood-Based Music API is live!"}`

## Why Remove Dockerfile?

- **Simpler**: Railway's Nixpacks auto-detects Python projects
- **Faster builds**: No need to build Docker image
- **Better PORT handling**: Procfile with Python script handles PORT correctly
- **Less configuration**: Railway handles dependencies automatically

## If You Need Dockerfile Later

You can always restore it:
```bash
mv backend/Dockerfile.backup backend/Dockerfile
git add backend/Dockerfile
git commit -m "Restore Dockerfile"
git push
```

---

**Recommended**: Use **Method 2** (rename Dockerfile) - it's the most reliable way to ensure Railway uses Procfile.
