

## Add Image Upload for Product Thumbnails

### What changes
Add the ability to upload an image file directly from the admin dashboard as a product thumbnail, in addition to the existing URL input. Uploaded images will be stored in Lovable Cloud file storage.

### How it works
1. A new storage bucket called `product-thumbnails` will hold uploaded images
2. In the admin product form, a file input will appear next to the existing "Thumbnail URL" field
3. When you pick a file, it uploads to storage and automatically fills in the thumbnail URL
4. You can still paste a URL manually if you prefer

### Technical Details

**Database migration (storage bucket + RLS):**
- Create a public `product-thumbnails` storage bucket
- Add RLS policies: admins can upload/delete, anyone can view

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('product-thumbnails', 'product-thumbnails', true);

CREATE POLICY "Anyone can view thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'product-thumbnails');
CREATE POLICY "Admins can upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-thumbnails' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'product-thumbnails' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'product-thumbnails' AND public.has_role(auth.uid(), 'admin'));
```

**`src/components/admin/ProductsTab.tsx`:**
- Add a file `<input type="file" accept="image/*">` below the Thumbnail URL field
- On file select, upload to `product-thumbnails` bucket using `supabase.storage.from('product-thumbnails').upload()`
- Generate the public URL using `supabase.storage.from('product-thumbnails').getPublicUrl()`
- Set the resulting URL into `form.thumbnail_url`
- Show a loading indicator during upload

**`src/pages/Labs.tsx`:**
- No changes needed -- it already uses `product.thumbnail_url` when available

