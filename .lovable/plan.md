

## Redesign Product Cards with Auto-Generated Website Thumbnails

### What changes
Redesign the product cards on the Labs page to include a live website thumbnail preview at the top of each card, generated automatically from the product's URL using a free thumbnail service. The cards will have a more visual, modern layout.

### Design
Each card will feature:
1. A website screenshot preview at the top (using `image.thum.io`, a free service that generates thumbnails from URLs -- no API key needed)
2. A subtle gradient overlay at the bottom of the thumbnail for smooth text transition
3. Logo + name + tag row below the image
4. Description text
5. "Visit" link at the bottom

The thumbnail URL pattern is simply: `https://image.thum.io/get/width/600/{product_url}`

### Technical Details

**`src/pages/Labs.tsx`**:
- Add a thumbnail section at the top of each card using an `<img>` tag with src `https://image.thum.io/get/width/600/${product.url}`
- Restructure card layout: image on top, content below
- Add a loading/placeholder state for the thumbnail using a neutral background
- Keep the existing hover effects and transitions
- Use `aspect-video` for consistent image dimensions
- Add `object-cover` and `object-top` to show the top portion of the screenshot
- Fallback to a neutral gradient background if the image fails to load

No database changes or new dependencies needed.

