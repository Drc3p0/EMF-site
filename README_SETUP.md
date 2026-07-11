# EMF Explorer Site — Setup Notes

Drafted 2026-06-13. This is a static site (5 pages + shared CSS/JS) ready for GitHub Pages.

## Pages
- `index.html` — Home / sales page (hero, product story, Lectronz buy box)
- `docs.html` — Assembly guide, safety, how it works
- `demos.html` — Sound examples, interactive frequency monitor, zine
- `workshops.html` — Workshop advertisement + contact
- `tutorials.html` — "What to listen to" field guide

## Theme
Green/space cyberpunk: dark background grid, neon green (#39ff94) + cyan (#5ef1ff) + magenta (#ff5ec4) accents, Orbitron display font + Space Mono body font (loaded from Google Fonts), animated starfield canvas (`assets/main.js`).

## Before going live — replace these placeholders

1. **Images** — every `[ bracketed placeholder ]` box marks where a real photo goes. Source images referenced from emfexplorer.space, sporklogic.com, and darcyneal.com (e.g. emfbadgeinhand.jpg, emflisteningtorobot.jpg, ToorcampEMFworkshop.jpeg, etc.) — download the ones you have rights to use and drop them in `assets/images/`, then update the `<div class="image-placeholder">` blocks to `<img>` tags.

2. **Lectronz product link** — in `index.html`, find both instances of `REPLACE_WITH_LECTRONZ_PRODUCT_LINK` (one in the Buy Now button, one in the Product JSON-LD `offers.url`) and replace with your real Lectronz product page URL. Lectronz handles EU VAT, tax, and shipping rate collection at checkout.

3. **Contact email** — in `workshops.html`, replace `REPLACE_WITH_CONTACT_EMAIL` with your real address.

4. **Interactive Frequency Monitor** — `demos.html` currently links out to sporklogic.com/frequency-monitor/. If you want it embedded directly, check whether it can run in an `<iframe>` (commented-out example included in the HTML).

5. **Custom domain** — add a `CNAME` file (no extension) to the root of this site containing just your domain, e.g.:
   ```
   emfexplorer.space
   ```
   Then in your domain's DNS settings, point it at GitHub Pages (A records to GitHub's IPs, or a CNAME record to `<username>.github.io` for subdomains). GitHub's docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Publishing to GitHub Pages

1. Create a new GitHub repo (or use an existing one).
2. Push these files to the repo (root, or a `/docs` folder — your choice).
3. In repo Settings → Pages, set the source branch and folder.
4. Add the `CNAME` file as described above if using a custom domain.

## Content sources used
- https://emfexplorer.space/
- https://sporklogic.com/emf-explorer-badge/
- https://sporklogic.com/emfguide
- https://darcyneal.com/emf-explorer-badge
- https://darcyneal.com/emf-explorer-workshops
- https://darcyneal.com/category/workshops
