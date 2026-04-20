# OmniverseTools — Build Plan

**Domain:** https://omniversetools.com
**Goal:** Free online utility tools that drive organic search traffic.
**Approach:** All tools are 100% client-side (browser only). No backend processing, no database,
no server RAM used. FastAPI serves the static Vite build. Nginx sits in front.

---

## Server Context

| Thing | Value |
|-------|-------|
| OS | Debian 12 (Bookworm) |
| CPU | 1 vCPU (AMD EPYC 7713) |
| RAM | 960MB total, ~234MB free |
| Disk | 25GB total, ~18GB free |
| Web server | Nginx 1.22.1 → uvicorn (FastAPI 0.135.3) |
| Node | v24.14.1 |

---

## Current Status — LIVE ✅

The site is fully deployed and running at **https://omniversetools.com**.

| Component | Status |
|-----------|--------|
| Vite + React frontend | ✅ Built, served from `/root/omniversetools/dist/` |
| FastAPI backend | ✅ Running via systemd (`omniversetools.service`) |
| Nginx reverse proxy | ✅ Running, HTTPS only |
| Let's Encrypt SSL | ✅ Cert issued, auto-renews via systemd timer (expires 2026-07-08) |
| UFW firewall | ✅ Ports 22, 80, 443, 51820 open |
| Pi-hole | ✅ Moved to `10.0.0.1:8080` (VPN only) to free port 80 |
| Cloudflare | ✅ In front of server (extra DDoS layer) |

---

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router + Lucide icons
- **Backend:** FastAPI (Python) — serves the Vite static build + SPA catch-all routing
- **Process manager:** systemd service (`/etc/systemd/system/omniversetools.service`)
- **Web server:** Nginx (reverse proxy, rate limiting, security headers, gzip)
- **Icons:** `lucide-react`
- **QR codes:** `qrcode` (npm)

---

## Tools Built ✅

| # | Tool | Route | Status |
|---|------|-------|--------|
| 1 | QR Code Generator | `/tools/qr-code` | ✅ Live |
| 2 | JSON Formatter & Validator | `/tools/json-formatter` | ✅ Live |
| 3 | Base64 Encoder / Decoder | `/tools/base64` | ✅ Live |
| 4 | Password Generator | `/tools/password-generator` | ✅ Live |
| 5 | Word & Character Counter | `/tools/word-counter` | ✅ Live |
| 6 | Unit Converter | `/tools/unit-converter` | ✅ Live |
| 7 | Color Picker / HEX ↔ RGB | `/tools/color-converter` | ✅ Live |
| 8 | Regex Tester | `/tools/regex-tester` | ✅ Live |
| 9 | URL Encoder / Decoder | `/tools/url-encoder` | ✅ Live |
| 10 | Markdown Previewer | `/tools/markdown-previewer` | ✅ Live |
| 11 | Hash Generator (SHA-1/256/384/512) | `/tools/hash-generator` | ✅ Live |
| 12 | Unix Timestamp Converter | `/tools/timestamp-converter` | ✅ Live |
| 13 | Image to Base64 | `/tools/image-to-base64` | ✅ Live |
| 14 | Text Diff Checker | `/tools/diff-checker` | ✅ Live |
| 15 | JWT Decoder | `/tools/jwt-decoder` | ✅ Live |
| 16 | CSS Minifier / Beautifier | `/tools/css-minifier` | ✅ Live |
| 17 | HTML Minifier / Beautifier | `/tools/html-minifier` | ✅ Live |
| 18 | CRON Expression Explainer | `/tools/cron-explainer` | ✅ Live |
| 19 | Lorem Ipsum Generator | `/tools/lorem-ipsum` | ✅ Live |
| 20 | Number Base Converter | `/tools/number-base-converter` | ✅ Live |
| 21 | UUID Generator | `/tools/uuid-generator` | ✅ Live |
| 22 | String Case Converter | `/tools/string-case-converter` | ✅ Live |
| 23 | SQL Formatter | `/tools/sql-formatter` | ✅ Live |
| 24 | HTML Entity Encoder / Decoder | `/tools/html-entity-encoder` | ✅ Live |
| 25 | Percentage Calculator | `/tools/percentage-calculator` | ✅ Live |
| 26 | Age Calculator | `/tools/age-calculator` | ✅ Live |
| 27 | Text Sorter & Line Tools | `/tools/text-sorter` | ✅ Live |
| 28 | BMI Calculator | `/tools/bmi-calculator` | ✅ Live |
| 29 | BMR & Calorie Calculator | `/tools/bmr-calculator` | ✅ Live |
| 30 | Ideal Weight Calculator | `/tools/ideal-weight-calculator` | ✅ Live |
| 31 | Tip Calculator | `/tools/tip-calculator` | ✅ Live |
| 32 | Loan / EMI Calculator | `/tools/loan-calculator` | ✅ Live |
| 33 | Compound Interest Calculator | `/tools/compound-interest` | ✅ Live |
| 34 | Random Number Generator | `/tools/random-number-generator` | ✅ Live |
| 35 | Scientific Calculator | `/tools/scientific-calculator` | ✅ Live |
| 36 | Date Duration Calculator | `/tools/date-duration-calculator` | ✅ Live |
| 37 | Time Zone Converter | `/tools/timezone-converter` | ✅ Live |
| 38 | Slugify Tool | `/tools/slugify` | ✅ Live |
| 39 | JSON ↔ CSV Converter | `/tools/json-csv-converter` | ✅ Live |
| 40 | Colour Palette Generator | `/tools/color-palette-generator` | ✅ Live |
| 41 | Chmod Calculator | `/tools/chmod-calculator` | ✅ Live |

---

## Security Hardening Applied ✅

| Layer | What's enforced |
|-------|----------------|
| **Nginx** | Rate limit 60 req/min/IP (burst 30), max 30 concurrent conns/IP, 429 on breach, 1MB body cap, 10s timeouts |
| **Nginx headers** | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy |
| **FastAPI** | Docs/OpenAPI disabled, TrustedHostMiddleware, server header stripped |
| **uvicorn** | Max 50 concurrent requests, auto-restart after 5000 requests, 256MB RAM cap, 80% CPU cap |

---

## Build & Deploy Commands

```bash
# Production build
cd /root/omniversetools/frontend && npm run build   # outputs to ../dist/

# Restart backend after code changes
systemctl restart omniversetools

# Reload Nginx after config changes
nginx -t && systemctl reload nginx

# Check service health
systemctl status omniversetools
systemctl status nginx

# View live logs
journalctl -u omniversetools -f
```

---

## Project Structure

```
omniversetools/
├── frontend/                         # Vite + React
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                   # React Router setup
│   │   ├── components/
│   │   │   └── Layout.jsx            # Navbar (desktop + mobile hamburger) + footer
│   │   └── pages/
│   │       ├── Home.jsx              # Landing page with tool grid
│   │       └── tools/
│   │           ├── QrCode.jsx
│   │           ├── JsonFormatter.jsx
│   │           ├── Base64.jsx
│   │           ├── PasswordGenerator.jsx
│   │           ├── WordCounter.jsx
│   │           ├── UnitConverter.jsx
│   │           ├── ColorConverter.jsx
│   │           └── RegexTester.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── main.py                       # FastAPI + SPA catch-all routing
│   └── requirements.txt
├── dist/                             # Vite build output (served by FastAPI)
└── PLAN.md
```

---

## Known Issues / Fixed

- **SPA routing was broken** — FastAPI `StaticFiles` returned 404 for direct URL access.
  Fixed by replacing mount with an explicit `/{full_path:path}` catch-all that always serves `index.html`.
- **Pi-hole blocked port 80** — Moved Pi-hole web UI from `:80` to `:8080` on wg0 only.
- **Scientific Calculator `asin/acos/atan` broken** — string-replacement approach produced `Math.aMath.sin(` and unbalanced parentheses. Rewrote `safeEval` to inject trig helpers as scoped functions instead. Also fixed: `e` (Euler's number button) was rejected by the sanitizer.
- **Date Duration Calculator display bug** — "Years + months + days" row was using total calendar months as the remainder months. Fixed by storing `remMonths` separately in state.

---

## Tool Overlap / Redundancy Notes

All 41 tools are intentionally distinct. Some pairs look similar but serve different search intent and user goals:

| Pair | Why they're different |
|------|-----------------------|
| Age Calculator vs Date Duration Calculator | Age is personal ("how old am I") with hours + birthday countdown; Duration is general-purpose with business days |
| BMI vs BMR vs Ideal Weight | Completely different formulas: weight/height² vs metabolic rate vs target-weight by formula |
| Percentage Calculator vs Tip Calculator | Tip has bill splitting (per-person split); Percentage is a general math multi-tool |
| String Case Converter vs Slugify | String Case outputs 8 formats simultaneously; Slugify is URL-focused with accent handling + max length |
| CSS Minifier vs HTML Minifier | Same UX pattern, different parsers — devs use both regularly |

---

## Next Steps (Suggested)

### SEO & Traffic (highest impact)
- [x] **Sitemap (`/sitemap.xml`)** — FastAPI route returning XML sitemap for all tool URLs
- [x] **`robots.txt`** — FastAPI route serving `robots.txt` pointing crawlers at the sitemap
- [ ] **Google Search Console** — verify domain, submit sitemap URL manually (speeds up indexing significantly)
- [ ] **Open Graph meta tags** — `og:title`, `og:description`, `og:url` per page for social previews
- [ ] **Structured data** — `application/ld+json` WebApplication schema on each tool page for rich results
- [ ] **Per-tool meta descriptions** — unique `<meta name="description">` on every tool page (currently missing); big on-page SEO win

### New Tools — Batch 6 (General Audience / High Search Volume)

**High search volume, easy wins**
- [x] **Word Frequency Counter** — paste text, see every word ranked by occurrence; useful for writers and SEO
- [x] **Reading Time Estimator** — paste an article, get estimated reading time (WPM adjustable)
- [x] **Character Limit Tester** — live counters for Twitter (280), LinkedIn (700), SMS (160), meta description (160), etc.
- [x] **Aspect Ratio Calculator** — given width × height, find the ratio and scale to any new dimension
- [x] **Roman Numeral Converter** — decimal ↔ Roman numerals, e.g. 2024 ↔ MMXXIV

**Finance (completes the set)**
- [ ] **VAT / Sales Tax Calculator** — add/remove tax from a price; pick common rates or enter custom %
- [ ] **Currency Formatter** — format a number as money in any locale/currency (client-side, no live rates)
- [ ] **Mortgage Calculator** — down payment, LTV, monthly payment + amortisation

**Health (completes the set)**
- [ ] **Body Fat Percentage Calculator** — US Navy method (neck + waist + height)
- [ ] **Water Intake Calculator** — daily water needs based on weight and activity level

### New Tools — Batch 7 (Personal / Power-User Tools)

These are tools *you* would actually open and use day-to-day as a developer and sysadmin.
All 100% client-side, no external dependencies.

**CSS / Frontend dev** *(open these constantly while building)*
- [ ] **CSS Gradient Generator** — visual gradient builder (angle, stops, colours) → copy CSS `linear-gradient()` code
- [ ] **CSS Box Shadow Generator** — sliders for offset, blur, spread, colour → copy `box-shadow` rule; multiple layers supported
- [ ] **Pixel ↔ REM / EM Converter** — instant px↔rem↔em at any base font size; table showing all common sizes
- [ ] **Flexbox / Grid Cheatsheet** — interactive property reference, click a property to see the effect live

**Developer productivity** *(things you'd use while debugging or writing code)*
- [ ] **YAML ↔ JSON Converter** — paste YAML, get JSON (and vice versa); uses `js-yaml`
- [ ] **URL Parser / Builder** — paste any URL, see protocol / host / path / query params / fragment in a table; edit fields and copy the rebuilt URL
- [ ] **HTTP Status Code Reference** — searchable list of all codes (1xx–5xx) with plain-English description and when to use each
- [ ] **Cron Expression Builder** — GUI complement to the existing explainer: pick schedule via dropdowns, get the cron string
- [ ] **JWT Generator** — complement the decoder; generate HS256/HS384/HS512 tokens client-side for testing
- [ ] **Markdown Table Generator** — paste tab/comma-separated data, get a formatted `| col | col |` Markdown table instantly
- [ ] **.gitignore Generator** — select your stack (Node, Python, Django, React, Go, Rust, etc.) → get the right `.gitignore` content

**Sysadmin / Networking** *(directly useful for managing your server)*
- [ ] **IP Subnet / CIDR Calculator** — enter a CIDR block (e.g. `10.0.0.0/24`), get network address, broadcast, usable host range, number of hosts — useful when configuring WireGuard subnets
- [ ] **Port Number Reference** — searchable table of well-known ports (22 SSH, 80 HTTP, 443 HTTPS, 3306 MySQL, etc.) with protocol and description
- [ ] **Base64 Image Data URI Viewer** — paste a `data:image/…;base64,…` URI and preview the image; complement to the existing Image to Base64 encoder

**File / Data tools** *(ad-hoc data wrangling)*
- [ ] **CSV Viewer** — drag-drop or paste a CSV, render it as a sortable, searchable table; no data leaves the browser
- [ ] **Image Compressor** — drag-drop JPG/PNG, compress using Canvas API, download result; 100% client-side, no upload
- [ ] **Unicode / Symbol Search** — searchable table of Unicode characters; click to copy; useful for finding ←→↑↓ © ™ π etc.

**Skipped (with reason)**
- ✗ **SSH Key Generator** — private keys should never be generated in a browser context; misleading to offer
- ✗ **DNS Lookup** — requires server-side network call; can't be done purely client-side
- ✗ **HTTP Header Inspector** — same; requires a proxy fetch
- ✗ **Code Runner / REPL** — server-side execution needed for anything beyond JS

### New Tools — Batch 8 (WordPress & Shopify)

Both platforms have large developer audiences actively searching for niche tools. All of these are 100% client-side.

**Works for both platforms**
- [ ] **Meta / OG Tags Generator** — fill in title, description, image URL, site name, Twitter handle → get the full `<head>` snippet ready to paste; live social card preview in the tool. High SEO value on its own.
- [ ] **Schema Markup Generator** — pick a schema type (Product, Article, FAQ, LocalBusiness, BreadcrumbList) → fill in fields → get the `<script type="application/ld+json">` block to drop into any page. Works for both WP and Shopify themes.
- [ ] **Robots.txt Generator** — platform presets (WordPress, Shopify, generic) + visual rule builder (Allow/Disallow lines, Sitemap pointer) → copy finished `robots.txt`
- [ ] **301 Redirect Map Builder** — paste a list of old → new URLs (one per line), choose platform, get ready-to-paste `.htaccess` RewriteRules (Apache/WordPress) or Nginx `rewrite` directives or a Shopify URL redirect CSV import file

**WordPress-specific**
- [ ] **PHP Serialize / Unserialize** — decode `a:2:{s:3:"foo";s:3:"bar";}` WordPress database values back to readable JSON, and vice versa. Huge for debugging `wp_options`, ACF fields, serialized meta. Pure JS implementation, no PHP needed.
- [ ] **WordPress Password Hash Generator** — generate `phpass`-compatible hashes that can be pasted directly into `wp_users.user_pass` in the database (for emergency admin recovery). Client-side JS port of phpass.
- [ ] **.htaccess Generator** — start from the standard WordPress permalink block, then toggle optional security rules: block xmlrpc, hide WordPress version, disable directory listing, set security headers, limit login page access by IP
- [ ] **WordPress Cron Viewer** — paste the raw serialized value of the `cron` option from `wp_options` → decode and display all scheduled events in a clean table (hook name, args, schedule, next run). Saves opening phpMyAdmin.

**Shopify-specific**
- [ ] **Shopify Variant Matrix** — enter product options and their values (e.g. Size: S / M / L / XL, Colour: Red / Blue) → see all variant combinations generated, total count, and a CSV-ready list. Useful before building out a product in the admin.
- [ ] **Liquid Filter / Tag Reference** — searchable, categorised cheatsheet for all Shopify Liquid filters (`upcase`, `split`, `where`, `map`, `money`, etc.) and tags (`for`, `if`, `paginate`, etc.) with examples. Static — no server needed.
- [ ] **Shopify Image URL Resizer** — transform a Shopify CDN image URL into any size variant using Shopify's `_300x300`, `_master`, `_2048x2048` etc. URL syntax; shows all common size strings side by side.
- [ ] **Shopify Metafield Builder** — define namespace + key + type, get the correct metafield reference syntax for Liquid (`product.metafields.custom.my_field`) and the REST/GraphQL API payload — eliminates the docs lookup.

**Skipped (with reason)**
- ✗ **Liquid Template Preview** — rendering Liquid requires a Shopify server; can't be done client-side
- ✗ **WordPress Plugin/Theme Compatibility Checker** — needs live API calls to wordpress.org
- ✗ **Shopify Theme Editor Preview** — requires authenticated Shopify session

### UX Polish
- [x] **Favicon** — flame SVG matching orange/red gradient theme
- [x] **Search** — home page search + nav dropdown search across all 41 tools
- [ ] **Copy-to-clipboard toast** — replace silent copy with a brief "Copied!" toast notification
- [ ] **Keyboard shortcuts** — e.g. `Ctrl+Enter` to trigger format/encode/generate actions
- [ ] **Persistent settings** — save password generator preferences to `localStorage`
- [ ] **"Back to tools" breadcrumb** — small link at top of each tool page back to home
- [ ] **Related tools widget** — bottom of each tool page: show 3–4 tools from the same category
- [ ] **Dark/light mode toggle** — currently dark-only; a toggle would broaden appeal

### Infrastructure
- [ ] **Analytics** — add privacy-respecting analytics (Plausible or Umami self-hosted) to track which tools get traffic
- [ ] **Error monitoring** — add a global React error boundary so tool crashes show a friendly message instead of a blank page
- [ ] **Cloudflare caching rules** — cache static assets at the edge (Vite assets are content-hashed so safe to cache forever)
- [ ] **HTTPS on Pi-hole admin** — the Pi-hole UI at `10.0.0.1:8080` is HTTP-only over WireGuard; low priority but worth noting

### Automation (Pending GitHub Setup)

The goal is a fully automated pipeline where new tools are built and deployed with zero manual prompting.

**Step 1 — Push project to GitHub** *(prerequisite for everything below)*
- [ ] Create a GitHub repo (e.g. `omniversetools`) and push `/root/omniversetools/` to it
- [ ] Add a deploy key or token so the server can `git pull` from GitHub
- [ ] Set up a simple deploy script: `git pull && npm run build && systemctl restart omniversetools`

**Step 2 — Scheduled remote agent**
Once the repo exists, create a Claude Code scheduled trigger that:
1. Clones the repo into a remote cloud environment
2. Reads `PLAN.md`, finds the next unchecked `[ ]` tool in the current batch
3. Builds the tool following the existing patterns (React component + route registration)
4. Commits and pushes to GitHub
5. The server auto-pulls and deploys (via a post-receive hook or a cron `git pull`)

Suggested schedule: **daily** — one tool per day clears the backlog in ~2 months hands-free.

**Context window tips (until automation is live)**
- Start a **fresh session** for each tool build — don't continue long sessions
- Use this prompt template to keep context minimal:
  ```
  See /root/omniversetools/PLAN.md for full context.
  Build the next unchecked tool in Batch 6 — same patterns as existing tools.
  Build and deploy. No verification needed.
  ```
- Run `/clear` between unrelated tasks to avoid compaction
