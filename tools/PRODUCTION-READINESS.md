# Production readiness — 17 September 2026

## Completed and verified locally

- Extensionless page URLs, with permanent redirects from old `.html` addresses, legacy category names and virtual trailing-slash URLs. Existing query parameters are retained.
- Canonical metadata, sitemap and internal links use clean URLs.
- 41 document-export pages now contain their finished HTML layouts. The raw document no longer flashes before JavaScript runs. Interactive menus, product tabs, pack selection and baskets still initialise normally.
- Removed exported document comments/styles, a stray metadata label, and three outdated MedishopUK branding references.
- Apache directory listing is disabled. `.git`, development tools and Apps Script source are blocked from public HTTP access. Basic security headers and UTF-8 are configured.
- 49 pages checked: successful responses, old-URL redirects, one H1 per page, mobile overflow, browser errors, and product tab/add-to-basket interactions.
- 89 internal links/assets checked with no missing resources or unnecessary redirects.
- Seven category routes and desktop/mobile navigation checks passed.
- 40 checkout fallback checks passed: Google Apps Script failure or timeout never prevents the chat redirect; failed saves retain the basket.

## Launch checks still required

1. Confirm hosting uses Apache with `mod_rewrite`, `AllowOverride` support and permission for the directives in `.htaccess`. Other servers require equivalent routing rules.
2. Configure the live domain, TLS certificate, HTTPS redirect and canonical `www.midlandsrx.co.uk` host in the hosting panel. The local environment cannot prove production DNS, TLS or host configuration.
3. Review and publish owner-approved Privacy and Terms information. No dedicated pages currently exist. Review business, pharmacy and professional-registration claims in the existing content before publishing; this code review does not verify those claims.
4. Confirm the intended Apps Script deployment and spreadsheet. The configured health endpoint returned HTTP 200 and `{ok:true, service:"MidlandsRx data API"}`, but omitted the spreadsheet ID returned by the checked-in script. No real orders/reviews were submitted during verification, so successful live writes and moderation remain unverified.
5. Perform one owner-approved end-to-end order and review check after upload. Telegram currently opens the configured account without prefilled basket details; WhatsApp includes the order text. If the API is unavailable, Telegram users need to provide their basket details in chat.
6. All removed medicine photos use the existing illustration. Confirm this is the intended launch imagery.

## Deploy

The release ZIP under `tools/release/` contains only public site files, assets and `.htaccess`. Extract its contents into the domain's document root, including the hidden `.htaccess` file. No database or Node server is required. Keep development tools, Git metadata and Apps Script source off the host. The ZIP is protected from public access by the project's `.htaccess`.

After upload, check home, shop, a category, a medicine, a blog post and Contact Us on desktop/mobile; check one old `.html` URL redirects once to the clean URL; verify checkout and HTTPS. Submit the updated sitemap after the domain is live.

## Maintenance

Edit the finished HTML files directly. `pages.js` now recognises `data-prerendered` and binds the menu without rebuilding the page. `product.js` reuses the saved product layout and binds interactions. `tools/prerender-pages.js` can convert newly added document-export pages and skips existing prerendered pages. Older generator scripts are not the source of truth for the finished HTML: rerunning them may overwrite current layouts and URLs, so always rerun the verification tools afterward.

Nothing has been uploaded or deployed by this task.
