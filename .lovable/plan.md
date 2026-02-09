

## Add Query/Message Field to Contact Form

### What changes
Add a "Query" textarea field to the contact form so users can describe what they want to connect about.

### Technical Details

**Database migration**: Add a nullable `query` column to `contact_submissions` table (nullable so existing rows aren't affected):
```sql
ALTER TABLE public.contact_submissions ADD COLUMN query text;
```

**`src/pages/Contact.tsx`**:
- Add `query` (optional) to the zod schema with max 1000 characters
- Add a full-width Textarea field below the Address row, labeled "Your Query"
- Include it in the Supabase insert call

**`src/components/admin/ContactSubmissionsTab.tsx`**:
- Add a "Query" column to the admin submissions table so admins can see what was submitted

