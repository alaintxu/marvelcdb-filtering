# ToDo

## My ToDos
- [x] Check if we can use https://astryx.atmeta.com/components components for the project. Is that interesting? Remove current external components that can be done with this library.
  - Finished: `@astryxdesign/core` 0.7.16 + `theme-neutral` are installed; Bootstrap modal → Astryx `Dialog`, buttons → `Button`, `react-select` → `MultiSelector`, `@draperez/react-components` (pagination and icon factory) → `Pagination` + `Icon`, and `react-markdown` → `Markdown`; those dependencies are removed. Astryx catalogs load through `InternationalizationProvider` so its internal strings follow the selected language. Native `<details>` stays instead of `Collapsible`: the Bootstrap collapses were already gone and the native accordion needs no JS. Costs measured with the prebuilt CSS: `+110 kB` gzip JS and `+50 kB` gzip CSS when the pilot landed. Verdict: keep Astryx; the prebuilt `astryx.css` still ships every component, so `@astryxdesign/build` source builds (tree-shaken CSS) remain a separate follow-up now that the project is on Vite 8.
- [x] Remove Bootstrap, jQuery and Tailwind and use StyleX (https://stylexjs.com).
  - Finished: Bootstrap CSS (CDN link), jQuery and Bootstrap JS are gone, and so are Tailwind and its Vite plugin. `@stylexjs/unplugin` compiles StyleX in Vite and `@stylexjs/babel-plugin` does it for Jest (Babel now owns the TS/TSX transform there, so `ts-jest` was dropped). Every Bootstrap utility/component class became a StyleX style in `src/styles/ui.ts` or an Astryx component. Brand values live once in `src/styles/tokens.css`, exposed as StyleX variables through `tokens.stylex.ts`. Global/animation CSS stays in `App.css`. Tests that queried `.alert-danger` now use `[data-variant='danger']`.
- [x] Migrate to bun.
  - Finished: `bun.lock` replaces `package-lock.json`, `packageManager` pins bun 1.4.4, both workflows use `oven-sh/setup-bun` + `bun install --frozen-lockfile`, and the devcontainer installs bun through the `devcontainers-extra` feature and runs `bun install` in `postCreateCommand`. Jest still runs through `bun test`; `bun test`'s own runner is not used.
- [x] Improve styling so elements are coherents between them. Try to simulate Marvel's style books for their "imagen de marca".
  - Finished: one red accent (#EC1D24), heavy display type (Impact/Arial Narrow) for headings and primary actions, ink panels, paper surfaces, skewed navigation and a 4px brand underline. Alerts are dark comic-panel callouts with a 4px accent edge; deck aspects have one hue each (aggression red, justice amber, leadership blue, protection green, pool red). This is the restrained option: card art stays the loud element, no halftone overlays behind text.
- [ ] Can selected decks be exported? Is enough with the deck id?
- [ ] Can the user experience be improved when cards are being loaded? Can that loading be faster? Do we have Skeletons in the cards for when they are loading? Do we need them?
- [ ] Check new added SKILLs to see if any improvement is recommended.

## Modern Web Guidance audit

### Open decisions
- **Filter and download panel model.** Use a `<dialog>` opened with `showModal()` if they are drawers only, which is the guide's default. Use `role="dialog"` with `popover="manual"` if they also act as a desktop sidebar.
- **Bootstrap JS.** Resolved: removed together with jQuery; the modal uses Astryx `Dialog` and the accordions are native `<details>`.
- **Browser target: decided.** You chose Baseline Widely Available, so `closedby`, `command`/`commandfor`, exclusive `details name`, `scrollbar-color`, and the Sanitizer API need the fallbacks from their guides.

### Not verified
- `legacy-scan` ran over `src/` and `index.html`. It covers about 20% of the guides, and its 3 findings are already listed (`src/App.css` lines 7, 16, and 22). The other guide IDs come from local file names. `search` and `retrieve` were not run for them.
- Runtime jQuery use and duplicated Tailwind output: resolved by removing both; the production build was checked for leftover Bootstrap/Tailwind CSS.
- Contrast ratios are hand calculations.
