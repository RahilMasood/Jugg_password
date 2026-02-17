# CORS Error Fix

## ✅ Good News: Frontend is Deployed!
Your frontend is live at: `https://password.verityaudit.in`

## ❌ Problem: CORS Error
The backend at `https://userauth.verityaudit.in` is blocking requests from your frontend.

**Error:**
```
Access to fetch at 'https://userauth.verityaudit.in/api/v1/password/change' 
from origin 'https://password.verityaudit.in' has been blocked by CORS policy
```

## 🔧 Solution: Update Backend CORS Configuration

You need to add your frontend URL to the backend's CORS allowed origins.

### Option 1: Add Environment Variable (Recommended)

In Railway, for your **Verity_User_Auth** service:

1. Go to Railway Dashboard
2. Click on your **Verity_User_Auth** service
3. Go to **Variables** tab
4. Add new variable:
   - **Name**: `PASSWORD_TOOL_URL`
   - **Value**: `https://password.verityaudit.in`
5. **Save** and **Redeploy** the backend service

The backend code should already have this configured in `src/app.js`:
```javascript
process.env.PASSWORD_TOOL_URL  // This will be added to CORS origins
```

### Option 2: Update CORS in Backend Code

If the environment variable doesn't work, update the backend code:

**File**: `Verity_User_Auth/src/app.js`

Find the CORS configuration and add your frontend URL:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CLIENT_PORTAL_URL, 
        process.env.CONFIRMING_PARTY_PORTAL_URL,
        process.env.CLIENT_ONBOARD_URL,
        process.env.INDEPENDENCE_TOOL_URL,
        process.env.PASSWORD_TOOL_URL,  // ← Should already be here
        'https://password.verityaudit.in'  // ← Add this directly if needed
      ].filter(Boolean)
    : '*',
  credentials: true
};
```

Then commit and redeploy the backend.

### Option 3: Quick Fix - Allow All Origins (Development Only)

⚠️ **Only for testing** - Not recommended for production:

In `Verity_User_Auth/src/app.js`, temporarily change:
```javascript
const corsOptions = {
  origin: '*',  // Allow all origins (NOT secure for production!)
  credentials: true
};
```

## 📋 Steps to Fix

1. **Go to Railway Dashboard**
2. **Select Verity_User_Auth service**
3. **Variables tab** → Add:
   - `PASSWORD_TOOL_URL` = `https://password.verityaudit.in`
4. **Redeploy** the backend service
5. **Test** the frontend again

## ✅ Verify It's Fixed

After updating CORS, test the password change form:
1. Go to: `https://password.verityaudit.in`
2. Fill in the form
3. Submit
4. Check browser console - CORS error should be gone

## 🔍 Check Backend Logs

If still not working, check backend logs:
1. Railway Dashboard → Verity_User_Auth service
2. Deployments → View Logs
3. Look for CORS-related messages

## Additional Notes

- The backend needs to be redeployed after adding the environment variable
- Make sure the password change endpoint exists: `POST /api/v1/password/change`
- The endpoint should be public (no authentication required)

