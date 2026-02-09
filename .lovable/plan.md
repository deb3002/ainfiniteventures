

## Assign Admin Role

### What This Does
Runs a single database command to give your account (`deb3002@gmail.com`) the admin role, unlocking full access to the product management dashboard at `/admin/dashboard`.

### Technical Details
A database migration will insert a row into the `user_roles` table:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('c6d76a4e-fa8d-42a5-a9d7-3d194e3acd7a', 'admin');
```

No code changes are needed -- the existing `AuthContext` and `ProtectedRoute` will automatically recognize your admin status once this row exists.

