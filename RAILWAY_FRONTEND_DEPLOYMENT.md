# Deploy Password Tool Frontend to Railway

## Overview
This guide explains how to deploy the Password Tool frontend (static HTML site) to Railway.

## Prerequisites
- Railway account (sign up at https://railway.app)
- Railway CLI installed (optional, can use web interface)
- Git repository (or deploy directly from folder)

## Option 1: Deploy as Static Site (Recommended)

### Step 1: Create a Simple Node.js Server (for Railway)

Railway works best with Node.js projects. Create a simple Express server to serve the static files:

**Create `package.json`:**
```json
{
  "name": "password-tool-frontend",
  "version": "1.0.0",
  "description": "Password Change Tool Frontend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Create `server.js`:**
```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Deploy to Railway

#### Method A: Using Railway Web Interface

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"** (if you have a repo) OR **"Empty Project"**
4. **If Empty Project**:
   - Click "Add Service"
   - Select "GitHub Repo" or "Empty Service"
   - If Empty Service, you'll need to connect via CLI or upload files

#### Method B: Using Railway CLI (Easier)

1. **Install Railway CLI** (if not installed):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Railway in your project**:
   ```bash
   cd "C:\Users\HP\Desktop\Password Tool"
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Get your deployment URL**:
   ```bash
   railway domain
   ```

### Step 3: Configure Environment Variables (Optional)

If you need to change the API URL dynamically, you can set it as an environment variable:

1. In Railway dashboard, go to your service
2. Click on "Variables" tab
3. Add: `API_URL=https://userauth.verityaudit.in/api/v1`
4. Update `index.html` to read from environment (see below)

## Option 2: Deploy as Pure Static Site

If Railway supports static site deployment directly:

1. **Create `railway.json`**:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx serve -s . -l $PORT"
  }
}
```

2. **Create `package.json`** (minimal):
```json
{
  "name": "password-tool-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "npx serve -s . -l $PORT"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

3. **Deploy using Railway CLI or Web Interface**

## Option 3: Use Railway Static Site Template

Railway has templates for static sites. You can:

1. Go to Railway Dashboard
2. Click "New Project"
3. Select "Deploy from Template"
4. Choose a static site template
5. Upload your `index.html` and `public/` folder

## Recommended: Express Server Method

I recommend **Option 1** (Express server) because:
- ✅ More reliable on Railway
- ✅ Better control over routing
- ✅ Can add API proxy if needed
- ✅ Easier to configure

### Complete Setup Files

**1. Create `package.json`** in the Password Tool folder:
```json
{
  "name": "password-tool-frontend",
  "version": "1.0.0",
  "description": "Password Change Tool Frontend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**2. Create `server.js`** in the Password Tool folder:
```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Password Tool Frontend running on port ${PORT}`);
  console.log(`API URL: ${process.env.API_URL || 'https://userauth.verityaudit.in/api/v1'}`);
});
```

**3. Create `.gitignore`** (if using Git):
```
node_modules/
.env
*.log
```

## Deployment Steps (Express Method)

### Using Railway CLI:

```bash
# Navigate to project folder
cd "C:\Users\HP\Desktop\Password Tool"

# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Initialize Railway project
railway init

# Deploy
railway up

# Get your URL
railway domain
```

### Using Railway Web Interface:

1. **Create a GitHub repository** (optional but recommended):
   - Create a new repo on GitHub
   - Push your Password Tool folder to it

2. **Go to Railway Dashboard**:
   - https://railway.app/dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Railway will automatically detect**:
   - Node.js project (from package.json)
   - Install dependencies
   - Run `npm start`

4. **Get your deployment URL**:
   - Railway will provide a URL like: `https://password-tool-production.up.railway.app`
   - You can also add a custom domain

## Verify Deployment

1. **Visit your Railway URL** (e.g., `https://your-app.up.railway.app`)
2. **Test the password change form**
3. **Check browser console** for any API connection errors
4. **Verify API calls** are going to `https://userauth.verityaudit.in/api/v1/password/change`

## CORS Configuration

Make sure the backend has your frontend URL in CORS allowed origins:

In Railway, for the **Verity_User_Auth** service, add environment variable:
```
PASSWORD_TOOL_URL=https://your-railway-frontend-url.up.railway.app
```

## Troubleshooting

### Issue: 404 errors
- **Solution**: Make sure `server.js` serves `index.html` for all routes

### Issue: API calls failing
- **Solution**: Check that `window.API_URL` in `index.html` is set correctly
- **Solution**: Verify CORS is configured on backend

### Issue: Static files not loading
- **Solution**: Ensure `public/` folder is in the same directory as `server.js`
- **Solution**: Check that `express.static(__dirname)` is configured correctly

## Next Steps

After deployment:
1. ✅ Test the password change functionality
2. ✅ Verify API connection to backend
3. ✅ Set up custom domain (optional)
4. ✅ Configure CORS on backend with your frontend URL

