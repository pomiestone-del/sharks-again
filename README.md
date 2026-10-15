# SHARKS, AGAIN.

An English-only Fabrication portfolio: white background, five original photographs, process notes drawn from the Notion journal, and links back to each weekly write-up.

## Page structure

1. **Hero** — display title, the group photograph of all five objects, a lede, and a meta table (course, span, shop tools, control, journal link).
2. **Index** — rows 01—05 with title, one-line description and week, each jumping to its project.
3. **Projects 01—05** — every object gets the same set of blocks, placed on a different part of a 12-column grid so the rhythm stays asymmetric:
   number and title · photograph · caption · process note · "what went wrong" · tools and materials · journal link.
4. **Footer** with the journal link.

## Run and edit

- Open `dist/index.html` directly, or host `dist` on any static web server. No build or dependencies required.
- Use the pencil button to edit titles, descriptions, notes and specs. Edits are stored in the current browser. Export and import text to transfer edits between browsers.
- To update the published content for every visitor, edit `dist/index.html` and redeploy. Layout is in `dist/style.css`; interactions are in `dist/script.js`.
- Original PNG photographs are in `dist/assets`.
- Click an image to enlarge it; press Escape to close. Responsive layouts and reduced-motion preferences are supported.
- Fonts (Bricolage Grotesque, Newsreader, DM Mono) load from Google Fonts, with local fallbacks when offline.

## Notes

- Editable text is marked with `data-edit="..."` in the HTML. Adding or renaming one of those keys changes what the editor saves.
- The browser storage key is `sharks-again-editorial-v4`; bump it in `script.js` whenever the published copy changes enough that old local edits should be dropped.
- Desktop placement per project lives in the `@media (min-width: 861px)` block of `style.css` under the `.p-a`—`.p-e` classes. Below that width everything stacks in one column.
- The five photographs are full-size PNGs (about 12 MB in total). Converting them to WebP would cut the first-load weight substantially without changing the layout.
