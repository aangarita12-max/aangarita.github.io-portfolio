# aangarita.github.io-portfolio

Personal portfolio site for Andrés Angarita — Senior Graphic Designer & Digital Design Manager.

Static site, vanilla HTML/CSS/JS. No frameworks, no build step, no dependencies to install.

## File structure

```
index.html      Home — hero wordmark, intro, featured work, about tease, closing CTA
projects.html   Projects — filterable list of work by category
about.html      About — photo carousel, bio, specialties accordion, clients, testimonials
styles.css      Single shared stylesheet (tokens, layout, components, responsive rules)
main.js         Shared behavior: mobile nav, scroll reveal, custom cursor, filter chips,
                accordion, and a small slider used by both the photo carousel and testimonials
assets/         Placeholder images (SVG). Replace with real photography/logos.
```

All three pages include the same `<link rel="stylesheet" href="/styles.css">` and
`<script src="/main.js"></script>` — there is nothing page-specific to wire up beyond
the markup already in each HTML file.

## Running locally

No build step. Serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

(Opening the HTML files directly via `file://` mostly works too, but a local
server avoids any path/CORS quirks with the `/assets` and `/styles.css` absolute paths.)

## Replacing placeholder content

Every piece of placeholder copy is prefixed with `[PLACEHOLDER]` so it's easy to
find and replace. Placeholder images live in `/assets` as simple labeled SVGs —
swap them for real photography/logos using the same filenames, or update the
`src` attributes to point at new files.

## Notes on behavior

- **Nav**: numbered links top-right, full-screen overlay with hamburger under 768px.
- **Filter chips** (`projects.html`): each project row carries a `data-tags`
  attribute; clicking a chip crossfades rows that don't match.
- **Accordion** (`about.html`): only one specialty panel open at a time, animated
  with a CSS grid-rows trick (no JS height measuring).
- **Carousel & testimonials** (`about.html`): share one slider implementation in
  `main.js`. Photo carousel auto-shows/swipes only; testimonials also auto-advance
  every 7s and pause on hover/focus.
- **Custom cursor**: only enabled on pointer-fine devices at 1200px and wider, and
  disabled entirely when `prefers-reduced-motion` is set.
- All motion respects `prefers-reduced-motion: reduce`.
