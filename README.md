# Intact — GitHub Pages

This folder contains the complete static website: HTML, CSS, JavaScript, local fonts, animation libraries, illustrations, favicon, video and all seven carousel slides. There is no build step. The LinkedIn page is a draft showcase; it does not publish posts.

## Publish the website

1. Create a GitHub repository and copy **the contents of this folder** to its root, including `.github/workflows/pages.yml` and `.nojekyll`.
2. Open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
3. Push the files to the `main` branch. The included workflow publishes the site. You can also run it with **Actions → Publish Pages → Run workflow**.
4. Open the URL shown in the completed deployment. Repository URLs such as `https://USERNAME.github.io/REPOSITORY/` and custom-domain roots are supported.

The footer’s LinkedIn link opens `linkedin.html`. That page has the original video, a working seven-slide carousel, complete captions and the format/hook/angle/Intact answer for the three campaign assets. Caption links automatically use the current deployment URL.

## Connect the real whitepaper gate

GitHub Pages serves static files; the gate runs in the separate **private-backend** package. Deploy that backend using its README, then edit the public `site-config.js`:

```js
window.INTACT_CONFIG = {
  guideApiOrigin: 'https://YOUR-DEPLOYED-WORKER.workers.dev'
};
```

Use the exact HTTPS origin printed by the Worker deployment, without a path. This URL is public configuration, not a secret. Push the updated file to GitHub.

Until connected, the two sample pages work and the access form reports that the backend needs configuration. It does not pretend to capture requests or unlock the guide. With the backend connected, name/email/company requests are stored in D1, the remaining pages load after authorization, and the PDF downloads. The GitHub version remembers a random grant in session storage for this browser tab, rather than using a third-party cookie. The server expires grants after 30 days.

**Only this folder belongs in the public Pages repository.** The full whitepaper, protected page images, backend code and original native Site source are delivered separately. Publishing those source assets in a public repository would bypass the gate.

## Edit and inspect

| File | Purpose |
| --- | --- |
| `index.html` | Main landing page and reader dialog |
| `contact.html` | Contact page |
| `linkedin.html`, `linkedin.css`, `linkedin.js` | LinkedIn showcase, captions, carousel and campaign rationale |
| `guide/index.html` | Two-page preview and standalone access form |
| `guide-privacy/index.html` | Guide request privacy details |
| `style.css`, `polish.css`, `decision.css`, `gm-focus.css`, `hero-data.css` | Landing-page styling |
| `motion.js` | GSAP entry, scroll and looping animation; reduced-motion behavior |
| `model.js`, `calculator.js`, `report.js` | USD estimate and PDF export |
| `guide-reader.js`, `guide-transport.js`, `guide-standalone-client.js` | Preview, gate and authenticated downloads |
| `site-config.js` | Backend origin |
| `assets/` | All public media, fonts, illustrations and animation libraries |
| `SHA256SUMS.txt` | File hashes from the export before your configuration edits |

For a local static preview, run `python3 -m http.server 8000` from this folder and open `http://localhost:8000/`. The deployed backend permits only the configured HTTPS frontend origin, so the local preview does not submit guide requests. The main page’s calculator and animation work without a backend.

The calculator estimates recurring ownership cost from visitor inputs. It is not an Intact price or a savings promise. The guide request form does not verify email, send email, subscribe anyone or connect to a CRM.

Validation at delivery covers source links and assets, exact media preservation, JavaScript syntax, calculator behavior, native reader behavior, backend authorization/capture/CORS, the native build and a backend dry-run build. Browser visual QA and a live deployment on your own GitHub/Cloudflare accounts were unavailable.

Official hosting references: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/).
