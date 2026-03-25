# Portfolio (static)

This is a lightweight, responsive portfolio page with sections for **Experience**, **Projects**, **Interests**, and a **Contact** form.

## Run locally

Open `index.html` in your browser, or use a tiny local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Customize

- Update your name, links, and content in `index.html`
- Update styling in `styles.css`
- Configure contact behavior in `script.js`

## Contact form options

In `script.js` set:

- `CONTACT_MODE = "mailto"`: opens the visitor’s email client (works anywhere)
- `CONTACT_MODE = "formspree"`: posts to Formspree (set `FORMSPREE_ENDPOINT`)
- `CONTACT_MODE = "netlify"`: enables Netlify Forms (deploy to Netlify)

## Deploy

### GitHub Pages

1. Create a GitHub repo and push these files.
2. In GitHub: **Settings → Pages**.
3. Set **Source** to your default branch and `/ (root)`.

### Netlify (drag & drop)

1. Go to Netlify and create a new site.
2. Drag this folder into Netlify.
3. If using Netlify Forms, set `CONTACT_MODE = "netlify"` in `script.js`.

