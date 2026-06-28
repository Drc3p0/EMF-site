# EMF Explorer - SEO & Visibility Strategy

Date: 2026-06-13

## What's done (on-page, in this repo)

- **Canonical URLs** on all 5 pages, pointing to `emfexplorer.space`.
- **Open Graph + Twitter Card tags** on all pages, so links posted to social media (Instagram, Mastodon, Discord, Slack, etc.) and AI assistants show a proper title, description, and preview image instead of a blank link.
- **JSON-LD structured data**:
  - `Organization` + `Product` schema on the homepage (price, availability, brand). This is what lets Google show a price/rating snippet in search results.
  - `FAQPage` schema on docs.html, built from the existing "Who's it for / What is EMF / How does it work / How's it made" content. This is the single highest-leverage thing for showing up in Google's "People also ask" and AI Overviews, and for being quoted directly by ChatGPT/Perplexity/Gemini.
  - `BreadcrumbList` on docs, demos, workshops, tutorials.
- **sitemap.xml** listing all 5 pages.
- **robots.txt** allowing all crawlers and pointing to the sitemap.
- **llms.txt** - an emerging convention some AI crawlers (and increasingly, retrieval tools) check for a clean summary of a site. Low cost, plausible upside.

These are all "necessary but not sufficient." None of this generates traffic by itself - it just makes sure that when someone (or something) does look at the site, it's legible and accurately represented.

## Reality check

A brand-new domain with no backlinks and no search history will not rank for competitive terms ("electronics kit", "soldering kit") regardless of how clean the markup is. SEO from zero takes months. The structured data mainly pays off once:
1. The site is actually live at emfexplorer.space (not yet, per our conversation), and
2. Search engines have crawled it at least once.

If you want results sooner, off-page distribution (below) matters far more than on-page polish at this stage.

## Prioritized checklist - things only you can do

### High priority (do once site is live)

1. **Google Search Console** - verify the domain, submit sitemap.xml. This is the fastest way to get indexed (days, not months) and gives you real search query data later.
2. **Bing Webmaster Tools** - same idea, also feeds Bing/ChatGPT's web search (Bing index is used by Copilot and some Perplexity results).
3. **Replace `REPLACE_WITH_STRIPE_PAYMENT_LINK`** in index.html - structured data references `#buy` but a dead "Buy Now" button hurts conversion and trust signals (high bounce rate is a negative ranking signal).
4. **Update README_SETUP.md placeholders** (contact email, etc.) before going live.

### Medium priority (ongoing, weekly effort)

5. **Backlinks from communities you're already in**: hackerspace wikis, ToorCamp/CCC project pages, Hackaday.io project page (huge for maker-electronics discovery and frequently scraped by AI tools), Make: magazine's site (you're already in Make: Vol 90 - ask if they'll link the project page).
6. **GitHub repo polish** - the README on github.com/drc3p0/emf-explorer-badge is heavily indexed and often surfaces in AI coding/hardware searches. Make sure it links to emfexplorer.space prominently.
7. **Social posting cadence** - Instagram and Mastodon posts that link to specific pages (e.g., a soundwalk clip linking to /demos.html) build both backlinks and the kind of engagement signal that helps "social SEO" (TikTok/Instagram's own search, which Gen Z increasingly uses instead of Google).
8. **YouTube** - your assembly guide and soundwalk videos are already on YouTube. Make sure each video description links to emfexplorer.space and uses keywords like "EMF detector kit", "solder your own EMF sensor", "DIY electromagnetic field listener". YouTube is the second-largest search engine and its results bleed into Google.

### Lower priority / experimental

9. **Reddit** - r/diyelectronics, r/somethingimade, r/hackerspaces, r/esp32-adjacent communities. A genuine "I made this" post (not a sales pitch) tends to outperform paid ads for niche maker products, and Reddit content is heavily weighted in Google's AI Overviews right now.
10. **AI-assistant visibility** - there's no reliable way to "submit" a site to ChatGPT/Claude/Gemini. The realistic path is: be well-represented on sites those tools already crawl (Reddit, GitHub, Wikipedia-adjacent wikis, Hackaday, Make:). llms.txt is a hedge, not a strategy.

## What I'd flag if you're treating this as a real launch

- "Maximum visibility... for new audiences" is a marketing goal, not an SEO task - SEO gets you found when someone is already searching for something like this. New-audience discovery for a $30 niche electronics kit comes overwhelmingly from social/video/community, not search. I'd weight your time roughly 80% toward items 5-10 above and 20% toward search infrastructure.
- Don't over-invest in JSON-LD/schema polish beyond what's done here - it has diminishing returns once the basics are in place, and the basics are now in place.
