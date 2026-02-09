

## Fix Ekahaani Thumbnail Not Loading

### Problem
The `image.thum.io` service returns a valid (200) but blank/white image for `ekahaani.com`. Since the image technically loads without an HTTP error, the `onError` fallback never triggers, leaving the card with an empty white area.

This is a common issue with screenshot services -- sites with heavy JavaScript rendering, loading screens, or bot protection often produce blank captures.

### Solution
Add a `thumbnail_url` column to the `products` table so you can manually upload or set a custom thumbnail for any product. When a custom thumbnail is provided, it takes priority over the auto-generated one. This gives you full control over what appears on the card.

### Changes

**Database migration:**
- Add nullable `thumbnail_url` (text) column to `products` table

**`src/pages/Labs.tsx`:**
- Update the `Product` interface to include `thumbnail_url`
- Use `product.thumbnail_url` as the image source when available; fall back to `image.thum.io` only when it's not set

**`src/components/admin/ProductsTab.tsx`:**
- Add a "Thumbnail URL" input field to the admin product form so you can paste a custom image URL for any product

### Technical Details

Thumbnail priority logic:
```
const thumbUrl = product.thumbnail_url || `https://image.thum.io/get/width/600/${product.url}`;
```

The existing `onError` fallback (gradient with initial letter) remains as the final safety net if both the custom and auto-generated thumbnails fail.

