# Password Tool Frontend

Password change tool frontend that connects to the Verity User Auth backend.

## Quick Deploy to Railway

### Option 1: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to this folder
cd "C:\Users\HP\Desktop\Password Tool"

# Initialize Railway project
railway init

# Deploy
railway up

# Get your deployment URL
railway domain
```

### Option 2: Using Railway Web Interface

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo" (if you have a repo) or "Empty Project"
4. If Empty Project:
   - Click "Add Service" → "GitHub Repo" or connect via CLI
5. Railway will automatically detect Node.js and deploy

## Configuration

The API URL is already configured in `index.html`:
- Production: `https://userauth.verityaudit.in/api/v1`

To change it, edit `index.html` around line 630.

## Files

- `index.html` - Main frontend application
- `server.js` - Express server to serve static files
- `package.json` - Node.js dependencies
- `public/` - Static assets (logo, etc.)

## Local Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# Visit http://localhost:3000
```

