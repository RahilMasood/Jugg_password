# Railway Deployment Troubleshooting

## Common Errors and Solutions

### Error: "Deploying from source failed"

**Solution 1: Add railway.json**
- ✅ Created `railway.json` with proper configuration
- This tells Railway how to build and start your app

**Solution 2: Check package.json**
- ✅ Ensure `start` script is defined: `"start": "node server.js"`
- ✅ Ensure `engines.node` is specified

**Solution 3: Verify all files are present**
- ✅ `package.json` - Node.js configuration
- ✅ `server.js` - Express server
- ✅ `index.html` - Frontend file
- ✅ `public/` folder - Static assets
- ✅ `railway.json` - Railway configuration (NEW)

### Error: "Cannot find module 'express'"

**Solution:**
Railway needs to install dependencies. Make sure:
1. `package.json` has `dependencies` section
2. Railway runs `npm install` during build
3. Check Railway build logs to see if `npm install` ran

### Error: "Port already in use" or "EADDRINUSE"

**Solution:**
The server.js already uses `process.env.PORT` which Railway provides automatically. This should work, but if not:
- Railway automatically sets `PORT` environment variable
- Your code uses: `const PORT = process.env.PORT || 3000;`
- This is correct ✅

### Error: "Build failed" or "Build timeout"

**Solution:**
1. Check Railway build logs
2. Ensure `package.json` is valid JSON
3. Try adding a build script: `"build": "echo 'No build step required'"`

### Error: "Application failed to start"

**Solution:**
1. Check Railway logs for runtime errors
2. Verify `server.js` syntax is correct
3. Ensure all required files are in the repository

## Deployment Checklist

Before deploying, verify:

- [ ] `package.json` exists and is valid JSON
- [ ] `server.js` exists and has correct syntax
- [ ] `index.html` exists
- [ ] `public/` folder exists with assets
- [ ] `railway.json` exists (NEW - added to fix deployment)
- [ ] `.gitignore` exists (to exclude node_modules)

## Testing Locally First

Before deploying to Railway, test locally:

```bash
# Install dependencies
npm install

# Start server
npm start

# Visit http://localhost:3000
# Should see the password change form
```

If it works locally, it should work on Railway.

## Railway-Specific Fixes

### If Railway doesn't detect Node.js:

Add `railway.json` (already created) with:
```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

### If build fails:

1. Check Railway dashboard → Your service → Deployments → View logs
2. Look for error messages
3. Common issues:
   - Missing dependencies in package.json
   - Invalid JSON in package.json
   - Missing files

### If deployment succeeds but app doesn't work:

1. Check Railway logs (Runtime logs, not build logs)
2. Verify the app is listening on the correct port
3. Check that static files are being served correctly

## Alternative: Use Railway Static Site Template

If Express server method doesn't work, try Railway's static site template:

1. Go to Railway Dashboard
2. New Project → Deploy from Template
3. Choose "Static Site" template
4. Upload your files

## Still Having Issues?

1. **Check Railway Logs**: Dashboard → Your Service → Deployments → View Logs
2. **Verify File Structure**: All files should be in root directory
3. **Test Locally**: Run `npm install && npm start` locally first
4. **Check Railway Status**: Visit https://status.railway.app

