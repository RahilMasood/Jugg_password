# Railway Deployment Checklist

## Current Status

### ✅ Frontend (Password Tool - index.html)
- **Status**: Ready to deploy
- **API URL**: Configured to `https://userauth.verityaudit.in/api/v1`
- **Location**: `index.html` + `public/` folder
- **Action**: Deploy to static hosting (Railway, Netlify, Vercel, etc.)

### ⚠️ Backend (Verity_User_Auth)
- **Status**: Needs password change endpoint
- **Current API**: `https://userauth.verityaudit.in/api/v1`
- **Missing**: Public password change endpoint at `/api/v1/password/change`

## What Needs to Be Done

### Backend: Add Password Change Endpoint

The backend needs a **public** password change endpoint that:
1. Accepts email (not user ID from token)
2. Searches in both `users` and `external_users` tables
3. Verifies current password
4. Updates password with bcrypt hash

**Required Files to Add:**
1. `src/services/passwordChangeService.js` - Service to handle password change logic
2. `src/controllers/passwordChangeController.js` - Controller for HTTP requests
3. `src/routes/passwordChange.js` - Route definition
4. Update `src/app.js` - Register the new route

### Environment Variables for Backend

Add these environment variables in Railway for the Verity_User_Auth service:

#### Required Variables:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
ENCRYPTION_KEY=your_32_character_encryption_key
```

#### Optional but Recommended:
```
PASSWORD_TOOL_URL=https://your-frontend-url.com
BCRYPT_ROUNDS=12
NODE_ENV=production
PORT=3000
```

#### CORS Configuration:
If deploying frontend separately, add:
```
PASSWORD_TOOL_URL=https://your-password-tool-frontend-url.com
```

This will allow CORS requests from your frontend.

## Deployment Steps

### Step 1: Backend (Verity_User_Auth)

1. **Add the password change endpoint code** (service, controller, route)
2. **Update `src/app.js`** to register the route:
   ```javascript
   const passwordChangeRoutes = require('./routes/passwordChange');
   app.use('/api/v1/password', passwordChangeRoutes);
   ```
3. **Set environment variables** in Railway:
   - Database connection variables
   - `ENCRYPTION_KEY` (must match existing key for email decryption)
   - `PASSWORD_TOOL_URL` (your frontend URL for CORS)
4. **Deploy to Railway**

### Step 2: Frontend (Password Tool)

1. **Verify API URL** in `index.html` (already set to `https://userauth.verityaudit.in/api/v1`)
2. **Deploy `index.html` and `public/` folder** to static hosting
3. **Test the connection**

## Testing

After deployment, test the endpoint:

```bash
curl -X POST https://userauth.verityaudit.in/api/v1/password/change \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "currentPassword": "oldPassword123",
    "newPassword": "NewPassword123"
  }'
```

**Expected Responses:**
- ✅ `200 OK` - Password changed successfully
- ❌ `404` - User email not found
- ❌ `400` - Current password is incorrect
- ❌ `400` - Validation error

## Summary

**Frontend**: ✅ Ready - Just deploy `index.html` + `public/` folder

**Backend**: ⚠️ Needs:
1. Password change endpoint code added
2. Environment variables configured in Railway
3. Route registered in `src/app.js`

Once the backend endpoint is added and environment variables are set, both are ready for Railway deployment.

