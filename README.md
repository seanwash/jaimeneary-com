# Jaime Neary portfolio

An Astro 7 static photography portfolio for Cloudflare Pages. It requires Node 24 for development and builds, with no CMS or database at runtime.

## Development

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

`npm run build` runs only `astro build`. It uses local content and public assets, without contacting Ghost or running an importer. The generated `dist/` directory is the deployment artifact.

## Editing content

- Gallery records live in `src/content/galleries/*.json`, validated by `src/content.config.ts`. Each record contains its title, description, display order, date, cover images and photo rows. The file name determines its existing public URL.
- The About text lives in `src/data/about.ts`, and its page layout is `src/pages/about.astro`.
- Shared navigation, footer and metadata are in `src/layouts/Page.astro`. `src/data/metadata.json` preserves the captured canonical/social/structured metadata.
- Images, responsive variants and the retained theme assets are in `public/`. Their existing paths and bytes are preserved.
- Search, sitemap and RSS are normal Astro static endpoints under `src/pages/`. RSS uses `@astrojs/rss`; `src/data/feed.json` preserves existing feed identifiers and publication timestamps so subscribers do not receive duplicate entries after migration.

The shared Astro components retain the Ghost theme's CSS classes and client-side lightbox behavior. These are static presentation assets and do not require a Ghost backend. Search uses the local Astro-generated index.

## Cloudflare preview

`wrangler.jsonc` points to `dist/` and defines no live-domain routes. The built output can be served locally:

```sh
npx wrangler pages dev dist --ip 127.0.0.1 --port 8791
```

The preview is excluded from indexing through HTML metadata, `public/_headers`, and `public/robots.txt`. Adjust all three deliberately before a live cutover while retaining noindex for preview hosts. `/rss/` redirects to the generated XML feed. Unmatched URLs serve the custom 404.

Cloudflare Pages builds directly from `seanwash/jaimeneary-com`, using the repository root, Node 24, build command `npm run check && npm run build`, and output directory `dist`. The initial deployment branch is `astro-cloudflare`; the default branch remains unchanged. The lockfile pins Astro, its RSS integration and Wrangler. Pushes to the selected branch trigger automatic builds. No custom domain is configured for this preview.

## Migration verification

Migration verification against the captured public site confirmed that all 13 regular pages retain their main text and image attributes, every archived asset matches its source hash, and existing RSS article identifiers/dates/links/titles are preserved. The extra generated page is the custom 404. Browser verification covers search results, lightbox navigation and mobile navigation.

The public capture is retained separately as migration provenance and is not a build dependency. A complete Ghost database/content, theme and media backup is still required before retiring the original service. This configuration has no live-domain routes.
