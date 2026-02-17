# Password Change Feature - Deployment Guide

## Overview
This document describes the password change feature that has been integrated into the Password Tool. The feature connects to the database through the Verity_User_Auth service.

## ⚠️ Important: Separate Deployment

**The frontend (`index.html`) and backend (`Verity_User_Auth`) are deployed separately.**

- **Backend**: Deploy `Verity_User_Auth` to Railway as one service
- **Frontend**: Deploy `index.html` + `public/` folder to a static hosting service (Railway, Netlify, Vercel, etc.)

### Quick Setup Checklist

**Backend (Verity_User_Auth):**
- [ ] Deploy to Railway
- [ ] Set `PASSWORD_TOOL_URL` environment variable (your frontend URL)
- [ ] Note your Railway backend URL

**Frontend (Password Tool):**
- [ ] Open `index.html` and set `window.API_URL` to your Railway backend URL (around line 620)
- [ ] Deploy `index.html` and `public/` folder to static hosting
- [ ] Test the connection

## Changes Made

### Backend (Verity_User_Auth)

1. **New Service**: `src/services/passwordChangeService.js`
   - Searches for users by email in `users` table first
   - If not found, searches in `external_users` table
   - Verifies current password using bcrypt
   - Updates password with new bcrypted password

2. **New Controller**: `src/controllers/passwordChangeController.js`
   - Handles HTTP requests for password changes
   - Validates input (email format, password requirements)
   - Returns appropriate error messages

3. **New Route**: `src/routes/passwordChange.js`
   - Endpoint: `POST /api/v1/password/change`
   - Public endpoint (no authentication required)

4. **Updated**: `src/app.js`
   - Added password change route registration

### Frontend (Password Tool)

1. **Updated**: `index.html`
   - Changed "User ID" field to "User Email"
   - Updated form to use email input type
   - Integrated API call to backend
   - Displays error messages from backend:
     - "User email not found"
     - "Current password is incorrect"
     - Other validation errors

## API Endpoint

### POST /api/v1/password/change

**Request Body:**
```json
{
  "email": "user@example.com",
  "currentPassword": "oldPassword123",
  "newPassword": "NewPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "email": "user@example.com",
    "table": "users"
  }
}
```

**Error Responses:**

1. User not found (404):
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User email not found"
  }
}
```

2. Incorrect password (400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

3. Validation errors (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error description"
  }
}
```

## Configuration

### Frontend API URL Configuration

The frontend needs to know the API URL. You can configure it in one of two ways:

1. **Set before page loads** (recommended for production):
   ```html
   <script>
     window.API_URL = 'https://your-api-domain.com';
   </script>
   <script src="your-main-script.js"></script>
   ```

2. **Default behavior**: If not set, it defaults to `http://localhost:3000` (for local development)

### Environment Variables (Backend)

The backend uses existing environment variables from Verity_User_Auth:
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `ENCRYPTION_KEY` - Encryption key for email encryption/decryption
- `BCRYPT_ROUNDS` - Bcrypt rounds (default: 12)

## Railway Deployment

### Important: Separate Deployment

**The frontend (`index.html`) and backend (`Verity_User_Auth`) are deployed separately.**

### Backend (Verity_User_Auth)

1. Deploy the Verity_User_Auth service to Railway as a separate service
2. The password change endpoint is already integrated: `POST /api/v1/password/change`
3. No additional configuration needed - it uses existing database connection
4. Ensure environment variables are set in Railway:
   - Database connection variables (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`)
   - `ENCRYPTION_KEY` (must match the key used to encrypt existing emails)
   - `BCRYPT_ROUNDS` (optional, defaults to 12)
   - `PASSWORD_TOOL_URL` (optional, but recommended - your frontend URL for CORS)
5. Note the Railway URL for your backend service (e.g., `https://verity-user-auth-production.up.railway.app`)

### Frontend (Password Tool) - Separate Deployment

**The `index.html` file is deployed separately from the backend.**

1. **Deploy to Static Hosting Service**
   - Deploy `index.html` and `public/` folder to any static hosting service:
     - Railway (static site)
     - Netlify
     - Vercel
     - GitHub Pages
     - AWS S3 + CloudFront
     - Any other static hosting service

2. **Configure API URL**
   - **Before deploying**, you must set the API URL in `index.html`
   - Find the script section at the top (around line 619) and set:
     ```html
     <script>
       // Set your Railway backend URL here
       window.API_URL = 'https://your-verity-user-auth-railway-url.up.railway.app';
     </script>
     ```
   - Replace `https://your-verity-user-auth-railway-url.up.railway.app` with your actual Railway backend URL

3. **CORS Configuration**
   - The backend CORS is already configured to support the password tool
   - In `src/app.js`, the CORS configuration includes `process.env.PASSWORD_TOOL_URL`
   - **Set the environment variable in Railway**:
     - Variable name: `PASSWORD_TOOL_URL`
     - Value: Your frontend URL (e.g., `https://password-tool-production.up.railway.app`)
   - For development, CORS is set to `*` (allows all origins)
   - For production, the `PASSWORD_TOOL_URL` environment variable will be automatically included in allowed origins

### Deployment Steps Summary

1. **Backend (Verity_User_Auth)**:
   - Deploy to Railway
   - Set environment variables
   - Note the Railway URL

2. **Frontend (Password Tool)**:
   - Open `index.html`
   - Set `window.API_URL` to your Railway backend URL (around line 620)
   - Deploy `index.html` and `public/` folder to static hosting
   - Ensure CORS is configured on backend to allow your frontend URL

## How It Works

1. User enters email, current password, and new password
2. Frontend validates password requirements (8+ chars, uppercase, lowercase, number)
3. Frontend sends request to `/api/v1/password/change`
4. Backend searches for user:
   - First in `users` table (by encrypted email)
   - If not found, searches in `external_users` table
5. If user not found, returns "User email not found"
6. If user found, verifies current password using bcrypt
7. If password incorrect, returns "Current password is incorrect"
8. If password correct, hashes new password with bcrypt and updates database
9. Returns success message

## Testing

### Local Testing

1. Start Verity_User_Auth backend:
   ```bash
   cd Verity_User_Auth
   npm start
   ```

2. Open `index.html` in a browser (or serve it via a simple HTTP server)

3. Test with a user from either `users` or `external_users` table

### Test Cases

1. ✅ Valid user email from `users` table with correct password
2. ✅ Valid user email from `external_users` table with correct password
3. ✅ Invalid email (not in either table) - should show "User email not found"
4. ✅ Valid email but incorrect current password - should show "Current password is incorrect"
5. ✅ Valid email and password but new password doesn't meet requirements
6. ✅ Valid email and password but new password same as current password

## Notes

- The Verity_User_Auth folder will be removed later and deployed separately
- The password change feature is independent and can be used by any frontend
- Email encryption/decryption is handled automatically by the service
- Passwords are always stored as bcrypt hashes

