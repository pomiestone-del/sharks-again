# SHARKS, AGAIN.

An English-only Fabrication portfolio: white background, five original photographs, process notes drawn from the Notion journal, and links back to each weekly write-up.

## Page structure

1. **Hero** — display title, the group photograph of all five objects, a lede, and a meta table (course, span, shop tools, control, journal link).
2. **Index** — a rail that sticks beside the projects on desktop and highlights whichever one you are reading; it stacks above them below 861px, and flattens into a contents page in the PDF.
3. **Projects 01—05** — every object gets the same set of blocks, placed on a different part of a 12-column grid so the rhythm stays asymmetric:
   number and title · photograph · caption · a verbatim quote from that week's journal, cited and linked ·
   the description · "what went wrong" · tools and materials.
   Projects 04 and 05 also carry a short clip from the journal, under the photograph.
4. **Footer** with the journal link and the PDF download.

## PDF edition

`dist/sharks-again-portfolio.pdf` is the same design as A4 landscape, seven pages:
cover, contents, then one page per project. It is produced from the site itself —
the layout lives in the `@media print` block of `dist/style.css` — so the two cannot
drift apart. Rebuild it after any change to the page:

```
pip install playwright pillow && playwright install chromium
python scripts/build-pdf.py
```

Videos cannot play in a PDF, so the clips print as still frames with a line pointing
back to the site.

## Run and edit

- Open `dist/index.html` directly, or host `dist` on any static web server. No build or dependencies required.
- Use the pencil button to edit titles, descriptions, notes and specs. Edits are stored in the current browser. Export and import text to transfer edits between browsers.
- To update the published content for every visitor, edit `dist/index.html` and redeploy. Layout is in `dist/style.css`; interactions are in `dist/script.js`.
- Original PNG photographs and the two MP4 clips are in `dist/assets`. Clips play muted on loop when scrolled into view, pause when they leave it, and take native controls with sound on click; with `prefers-reduced-motion` they do not autoplay.
- Click an image to enlarge it; press Escape to close. Responsive layouts and reduced-motion preferences are supported.
- One typeface for the whole page: IBM Plex Mono, from Google Fonts with a monospace stack behind it when offline. 400 for text, 600/700 for titles, italic for quotes and captions; labels are the same face, set uppercase and letterspaced. A monospace sets wider per character, so every size and the print scale are tuned for it.
- The site deploys to GitHub Pages from `.github/workflows/pages.yml` on every push to `main`.

## Notes

- Editable text is marked with `data-edit="..."` in the HTML. Adding or renaming one of those keys changes what the editor saves.
- The quotation marks around each pull quote are CSS `::before`/`::after`, so editing the quote cannot lose them. The shrinking "and again" run in the title is structural markup (one `--s` per repetition) and is not editable; the word SHARKS is.
- The browser storage key is `sharks-again-sidebar-v5`; bump it in `script.js` whenever the published copy changes enough that old local edits should be dropped.
- Desktop placement per project lives in the `@media (min-width: 861px)` block of `style.css` under the `.p-a`—`.p-e` classes. Below that width everything stacks in one column.
- The five photographs are full-size PNGs (about 12 MB in total). Converting them to WebP would cut the first-load weight substantially without changing the layout.
