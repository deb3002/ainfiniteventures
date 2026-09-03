# Fix 404 on /esg (Vercel SPA routing)

## What's happening

The error page shows `404: NOT_FOUND` with a Vercel request ID (`bom1::...`), so `www.ainfiniteventures.com` is being served by Vercel, not by Lovable hosting. Vercel is serving the built static files directly: `/` resolves to `index.html`, but `/esg` has no matching file on disk, so Vercel returns its own 404 before React Router ever runs.

This is not an app bug — `/esg` works on the Lovable preview and published URL because Lovable hosting has SPA fallback built in. Vercel needs to be told to do the same.

## The fix

Add a `vercel.json` at the project root that rewrites all non-file requests to `index.html`, letting React Router handle the path client-side:

```json
{
  "rewrites": [
    { "source": "/((?!data/|assets/).*)", "destination": "/index.html" }
  ]
}
```

The exclusions matter: the ESG page fetches `/data/esg-disclosures.json` at runtime. A blanket catch-all rewrite would return HTML for that request and the ESG table would fail to load. Excluding `data/` and `assets/` keeps real static files served as files.

After merging, Vercel must redeploy for the config to take effect (it applies at build/deploy time, not instantly).

## Verification after deploy

- `https://www.ainfiniteventures.com/esg` loads the ESG profile page directly and on refresh.
- The disclosure count shows 663 rows (confirms the JSON asset still resolves).
- `/labs`, `/consulting`, `/contact`, `/admin` also load on direct navigation.

## Note on hosting

You're currently running two hosting paths: Lovable (`ainfiniteventures.lovable.app`, works) and Vercel (the custom domain, broken deep links). If you'd rather not maintain the Vercel config, pointing the custom domain at Lovable hosting instead would fix this with no config file at all. Say the word and I can plan that route instead.
