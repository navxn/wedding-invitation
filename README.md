# Wedding Invitation — Dr. Nimisha Suresh & Dr. Rijul Padmanabhan M.

Static site (HTML + CSS + JS). No build step, no dependencies. Works on GitHub Pages (HTTPS).
Only external request: Google Fonts (HTTPS).

```
index.html          page, invitation wording, link-preview (Open Graph / Twitter) tags
css/style.css       emerald & gold design, animations, responsive rules
js/config.js        EDIT: maps links, calendar times, music file, WhatsApp text
js/main.js          links, repeatable scroll reveal, countdown, gold dust, music
js/decor.js         gold corner flourishes, lotus gardens, shimmer, touch effects
js/autoscroll.js    guided auto-scroll after the first manual scroll (pause button)
js/ending.js        end of invitation: pull past the end / tap cue to glide back
assets/img          emerald.jpg, ganesha-emblem*.png, g-*.svg, favicon, invite-preview.jpg (1200×630)
assets/audio        music.mp3
.nojekyll           tells GitHub Pages to serve the folder as-is
```
Everything uses relative paths, so the folder works from any address.

## Publish on GitHub Pages
The link-preview tags in `index.html` assume
`https://navxn.github.io/wedding-invitation/`
(GitHub user `navxn`, repository `wedding-invitation`). Use those names, or change them (step 4).

**Option A — website**
1. github.com → **New repository** → name `wedding-invitation` → **Public** → Create.
2. **Add file → Upload files** → drag in everything in this folder (keep the folders, include `.nojekyll`) → Commit.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
4. Wait ~1 minute. The site is at `https://<user>.github.io/<repo>/`.
   If that is not `https://navxn.github.io/wedding-invitation/`, replace that address in the five
   places in `index.html` (`canonical`, `og:url`, `og:image`, `og:image:secure_url`, `twitter:image`) and commit.

**Option B — command line** (GitHub CLI, run inside this folder)
```
git init -b main && git add . && git commit -m "Wedding invitation"
gh repo create wedding-invitation --public --source . --push
gh api -X POST repos/{owner}/wedding-invitation/pages -f "source[branch]=main" -f "source[path]=/"
```

## Check after publishing
- Open the public URL on a phone: opening screen, music button, scroll animations, Maps / Calendar / WhatsApp buttons.
- Open `…/assets/img/invite-preview.jpg` directly: it must show the emerald "You're Invited" image.
- WhatsApp preview: paste the link in a chat. WhatsApp caches previews; if it looks wrong, add `?v=2` to the link you share, or test with the Facebook Sharing Debugger (developers.facebook.com/tools/debug).

## Edit
- Maps / calendar / WhatsApp text / music: `js/config.js`.
- Wording: `index.html` (matches the printed card).
- Music: replace `assets/audio/music.mp3` (or set `musicFile` in `config.js`).
- The page is `noindex` (hidden from Google). Remove the `robots` line in `index.html` to make it searchable.
- The repository is public: anyone who finds it can read the page source (it contains the family phone number and address already shown on the invitation).
