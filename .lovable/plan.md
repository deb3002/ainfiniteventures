

## Fix: Login Button Stuck on "Please wait..."

### Problem
There's a race condition in `AuthContext.tsx`. The `onAuthStateChange` listener and `getSession()` both run on mount, and both `await checkAdmin()` before setting `loading = false`. When a login event fires, `onAuthStateChange` triggers but the async `checkAdmin` call can cause the `submitting` state in `AdminLogin` to never reset, because the navigation to `/admin/dashboard` depends on the auth state settling properly.

Additionally, the `AdminLogin` component sets `submitting` to true but only resets it on error -- on successful sign-in, the `onAuthStateChange` callback fires and the component may re-render in a state where `submitting` is still true.

### Solution
Refactor `AuthContext.tsx` to separate the initial load from ongoing auth changes (matching the proven pattern from the stack overflow solution):

1. **Initial load** controls `loading` state -- awaits both session fetch and role check before setting `loading = false`
2. **`onAuthStateChange` listener** updates session/user/role but does NOT await or control `loading`
3. Add `isMounted` guard to prevent state updates after unmount

### File Changes

**`src/contexts/AuthContext.tsx`**
- Restructure the `useEffect` to have `initializeAuth()` control the `loading` state
- Make `onAuthStateChange` fire-and-forget for `checkAdmin` (no await)
- Add `isMounted` cleanup flag

**`src/pages/AdminLogin.tsx`**
- Ensure `submitting` resets properly on success by resetting it in a `finally` block before navigating

