# Vendored fonts

Fonts used **only** by build scripts, not shipped to the browser. The site
itself loads its webfonts through `next/font` in `src/app/layout.tsx`.

| File                      | Family     | Weight | Source                                                            | License |
| ------------------------- | ---------- | ------ | ----------------------------------------------------------------- | ------- |
| `Newsreader-SemiBold.ttf` | Newsreader | 600    | [Google Fonts](https://fonts.google.com/specimen/Newsreader)      | SIL OFL 1.1 |

`Newsreader-SemiBold.ttf` is read by `scripts/build-og-image.js` so the Open
Graph card is typeset in the same display face as the site's headings. It is
vendored rather than downloaded at build time so the script stays reproducible
offline.

Geist Sans is not vendored here - `scripts/build-og-image.js` reads it straight
from the `geist` package in `node_modules`.
