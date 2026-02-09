

## Add Reset Password Option to Admin Login

### What changes
Add a "Forgot Password?" link on the admin login page that triggers a password reset email via the built-in authentication system, plus a simple password reset confirmation page.

### Technical Details

**`src/pages/AdminLogin.tsx`**:
- Add a "Forgot Password?" link below the password field
- When clicked, show an email-only form that calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/admin/reset-password" })`
- Toggle between login/signup/forgot-password views using state
- Show a toast confirming the reset email was sent

**`src/pages/ResetPassword.tsx`** (new):
- A page where users land after clicking the reset link in their email
- Contains a form with "New Password" and "Confirm Password" fields
- Calls `supabase.auth.updateUser({ password })` to set the new password
- On success, redirects to `/admin`

**`src/App.tsx`**:
- Add route `/admin/reset-password` pointing to the new ResetPassword page

No database changes needed -- password reset is handled entirely by the authentication system.

