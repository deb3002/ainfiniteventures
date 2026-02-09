

## Contact Page with Admin-Visible Submissions

### Overview
Create a `/contact` page with a form (name, email, phone, address). Submissions are saved to the database and visible to admins on the dashboard -- no email notifications needed.

### Changes

**1. Database -- new `contact_submissions` table**
- Columns: `id`, `name`, `email`, `phone`, `address`, `created_at`
- RLS: anyone can INSERT, only admins can SELECT and DELETE

**2. New page -- `src/pages/Contact.tsx`**
- Form with zod validation for name, email, phone, address
- Uses react-hook-form for form state
- Inserts into `contact_submissions` on submit
- Shows success/error toast
- Styled consistently with existing pages (Layout, FadeIn)

**3. Admin Dashboard -- add submissions tab**
- Add a tabbed view to `src/pages/AdminDashboard.tsx`: "Products" and "Contact Submissions"
- Contact Submissions tab shows a table with name, email, phone, address, date
- Admins can delete submissions they've reviewed

**4. Routing and navigation**
- Add `/contact` route in `App.tsx`
- Add "Contact" link in the navbar

### Technical Details

**Database migration:**
```sql
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
```

**Contact form validation:**
```typescript
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  address: z.string().trim().min(1, "Address is required").max(500),
});
```

**Admin Dashboard tabs** will use the existing Radix Tabs component to switch between Products and Contact Submissions views.
