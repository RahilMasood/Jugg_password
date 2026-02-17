# Password Update Fix

## Problem
The password change was logging success but the old password still worked. The new password wasn't being saved to the database.

## Root Cause
The UPDATE query was using encrypted email in the WHERE clause, but due to non-deterministic encryption (random IV), the encrypted email used for searching might not match the one stored in the database.

## Solution
Updated the password change service to:

1. **Use User ID instead of Email for UPDATE**: More reliable since ID doesn't change
2. **Store the exact encrypted email found**: Use the same encrypted email that was found during search
3. **Verify update success**: Check if rows were affected
4. **Properly hash password**: Ensure bcrypt hash is created before updating

## Files Created/Updated

### 1. `src/services/passwordChangeService.js`
- Uses `WHERE id = :user_id` instead of `WHERE email = :email` for UPDATE
- Stores `encryptedEmail` from the found user record
- Verifies update was successful (checks if rows affected > 0)
- Properly hashes new password with bcrypt before updating

### 2. `src/controllers/passwordChangeController.js`
- Handles HTTP requests
- Validates input
- Returns appropriate error messages

### 3. `src/routes/passwordChange.js`
- Route definition for `POST /api/v1/password/change`

## Key Changes in passwordChangeService.js

**Before (Problematic):**
```javascript
// Used encrypted email for WHERE clause - might not match!
const updateQuery = `
  UPDATE users
  SET password_hash = :password_hash
  WHERE email = :email  // ❌ Problem: encrypted email might not match
`;
```

**After (Fixed):**
```javascript
// Use user ID - always reliable!
const updateQuery = `
  UPDATE users
  SET password_hash = :password_hash,
      password_changed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = :user_id  // ✅ Fixed: ID always matches
`;

// Verify update succeeded
if (updateResult === 0) {
  throw new Error('Failed to update password - no rows affected');
}
```

## Deployment Steps

1. **Add the route to app.js** (if not already added):
   ```javascript
   const passwordChangeRoutes = require('./routes/passwordChange');
   app.use('/api/v1/password', passwordChangeRoutes);
   ```

2. **Commit and push to GitHub**:
   ```bash
   cd Verity_User_Auth
   git add src/services/passwordChangeService.js
   git add src/controllers/passwordChangeController.js
   git add src/routes/passwordChange.js
   git commit -m "Fix password change - use user ID for UPDATE query"
   git push
   ```

3. **Redeploy on Railway**:
   - Railway will automatically redeploy from GitHub
   - Or manually trigger redeploy

4. **Test**:
   - Try changing password
   - Verify old password no longer works
   - Verify new password works

## Testing

After deployment, test with:

```bash
curl -X POST https://userauth.verityaudit.in/api/v1/password/change \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com",
    "currentPassword": "oldPassword123",
    "newPassword": "NewPassword123"
  }'
```

Then verify:
1. ✅ Old password no longer works for login
2. ✅ New password works for login
3. ✅ Database shows updated password_hash

## Verification Query

Check the database to verify password was updated:

```sql
-- For users table
SELECT id, email, password_hash, password_changed_at, updated_at 
FROM users 
WHERE email = '<encrypted_email>';

-- For external_users table
SELECT id, email, password_hash, updated_at 
FROM external_users 
WHERE email = '<encrypted_email>';
```

The `password_hash` should be a new bcrypt hash (starts with `$2b$`), and `updated_at` should be recent.

