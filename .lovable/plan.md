

## Admin Login and Product Management

### Overview
Add a secure admin panel where authorized users can log in and manage products on the Ainfinite Labs page. This involves setting up Supabase for authentication and database storage.

### What You'll Get
- A login page at `/admin` for admins to sign in with email/password
- A protected admin dashboard to add, edit, and delete products from the Labs page
- Products stored in a database instead of being hardcoded, so changes persist instantly

---

### Implementation Steps

#### 1. Enable Supabase (Lovable Cloud)
Set up the backend database and authentication service.

#### 2. Database Setup
Create two tables:
- **products** -- stores name, description, URL, logo, and tag for each Labs product
- **user_roles** -- stores admin roles securely (separate from user profiles)

Security policies will ensure only admins can create, update, or delete products, while everyone can view them.

#### 3. Login Page (`/admin`)
A clean, minimal login form matching the site's design. Email and password fields with proper validation. Redirects to the admin dashboard on success.

#### 4. Admin Dashboard (`/admin/dashboard`)
A protected page (redirects to login if not authenticated) where admins can:
- View all current products in a list/table
- Add a new product (name, description, URL, logo URL, tag)
- Edit existing products inline
- Delete products

#### 5. Update Labs Page
The Labs page will fetch products from the database instead of using the hardcoded array, so any admin changes appear immediately.

#### 6. Auth Context
A shared authentication context so the app knows if a user is logged in and can protect admin routes.

---

### Technical Details

**New files:**
- `src/pages/AdminLogin.tsx` -- login form
- `src/pages/AdminDashboard.tsx` -- product management UI
- `src/contexts/AuthContext.tsx` -- auth state provider
- `src/components/ProtectedRoute.tsx` -- route guard
- `src/integrations/supabase/client.ts` -- Supabase client (auto-generated)

**Database migrations:**
1. Create `products` table with columns: `id`, `name`, `description`, `url`, `logo_url`, `tag`, `created_at`, `sort_order`
2. Create `user_roles` table with `app_role` enum (`admin`) and RLS policies
3. RLS policies: public read on products, admin-only write; role-check helper function (`has_role`)
4. Seed initial products from the current hardcoded array

**Modified files:**
- `src/App.tsx` -- add admin routes, wrap with AuthProvider
- `src/pages/Labs.tsx` -- fetch products from Supabase instead of static array

**First admin user:** After setup, you'll need to create an account via the login page and then manually assign the admin role (I'll provide the SQL command for that).

