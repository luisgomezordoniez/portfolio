# Luis Gomez — Portfolio

Personal portfolio for Luis Gomez Ordonez, MS in Data Science candidate at Columbia University (DSI Scholar) and former quantitative analyst at Banco de México.

**Live site: [luisgomezordoniez.github.io/portfolio](https://luisgomezordoniez.github.io/portfolio/)**

## Stack

Static site, plain HTML, CSS, and vanilla JS. No build step, no dependencies.

## Structure

```
portfolio/
├── index.html      # All content and layout
├── styles.css      # Styling and responsive behavior
└── script.js       # Contact form logic
```

## Run locally

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Contact form

Set `CONTACT_MODE` in `script.js`:

| Mode | Behavior |
|------|----------|
| `mailto` | Opens visitor's email client, works anywhere |
| `formspree` | Posts to Formspree, set `FORMSPREE_ENDPOINT` |
| `netlify` | Enables Netlify Forms, deploy to Netlify |

## Deploy

**GitHub Pages** — push to `main`, then Settings → Pages → Source: main / root.

**Netlify** — drag the folder into [netlify.com](https://netlify.com). Set `CONTACT_MODE = "netlify"` if using Netlify Forms.
