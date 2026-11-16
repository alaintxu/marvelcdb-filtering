# ToDo

## My ToDos
- [ ] Check if we can use https://astryx.atmeta.com/components components for the project. Is that interesting? Remove current external components that can be done with this library.
  - Pilot done: `@astryxdesign/core` 0.7.16 + `theme-neutral` are installed; the Bootstrap modal is now an Astryx `Dialog`. Costs measured with the prebuilt CSS: `+110 kB` gzip JS and `+50 kB` gzip CSS (the prebuilt `astryx.css` ships every component). The project is now on Vite 8, so `@astryxdesign/build` (source builds that tree-shake the CSS) is unblocked. Next candidates: `react-select` → Selector, `ReactBSPagination` → Pagination, Bootstrap collapses → Collapsible.
- [ ] Remove Bootstrap and Tailwind and use StyleX (https://stylexjs.com).
- [ ] Can selected decks be exported? Is enough with the deck id?
- [ ] Can the user experience be improved when cards are being loaded? Can that loading be faster? Do we have Skeletons in the cards for when they are loading? Do we need them?
- [ ] Migrate to bun.

## Modern Web Guidance audit

### Accessibility
- [x] High: Make closed filter and download panels `inert` while closed. They are hidden only by `transform` (`src/App.css` ~225), so their controls stay in the tab order and accessibility tree. Do not add `inert` to a native modal. (guide: html, dialog) — Done: `inert` is bound to the panel open state in `MainLayout`.
- [x] High: Add `aria-expanded` and `aria-controls` to the navigation panel toggles (`src/components/Navigation/Navigation.tsx`). (guide: navigation-drawer) — Done: panel toggles expose `aria-expanded` and the panel id in `aria-controls`.
- [x] High: Add Escape to close the filter and download panels. They currently close only on outside `mousedown` (`src/components/MainLayout.tsx` ~100–115). Settle the panel model first (see open decisions). (guide: navigation-drawer) — Done: a `keydown` listener closes the open panel. The panel markup itself is unchanged.
- [x] High: Respect `prefers-reduced-motion`. Keep opacity changes, and remove spatial motion under `reduce`: card flip (`src/App.css` ~136–152) and panel slides (~226, ~274). Do not use a global `animation-duration: 0.01ms`. The project has no reduced-motion query today. (guide: motion) — Done: the media query switches panel, card-list, and flip transitions to `opacity, visibility`.
- [x] Medium: Translate hard-coded accessible names: `src/components/Card/SingleCard/Card.tsx` (lines 128, 136–137, 142, 151, 184), `src/components/Navigation/Navigation.tsx` (53), `src/components/DownloadManager/Decks/DeckList.tsx` (34), `src/components/DownloadManager/Decks/DeckSection.tsx` (93), `src/components/DownloadManager/Packs/PacksSection.tsx` (69). Update the Spanish queries in `src/tests/cardImageRetry.spec.tsx`. (code review) — Done: new `global` keys in `en` and `es`; `de`/`fr`/`it`/`ko` fall back to `en`, matching the existing locale coverage.
- [x] Medium: Fix icon-only controls in `src/components/Filter/QuickSearchFilter.tsx`. Give the clear button a translated `aria-label`. Add `aria-hidden="true"` to decorative icons, since react-icons renders an unnamed `<svg>` by default (`src/components/IconForConcept/IconForConcept.tsx`). Change the input to `type="search"` and check for a second native clear button. (guide: icons, forms) — Done: labels added, icons are `aria-hidden` unless titled, and the native search clear button is hidden in CSS.
- [x] Medium: Replace the Bootstrap modal (`src/components/Modal/Modal.tsx`, `src/components/Modal/ModalButton.tsx`) with a native `<dialog>` opened with `showModal()`. Use `command="show-modal"` only if the target includes Invoker commands. Remove `role="dialog"`, `aria-modal`, and `aria-hidden`. If you use `closedby`, add the light-dismiss fallback. (guide: dialog, light-dismiss-a-dialog) — Done via Astryx `Dialog` (native `showModal`, focus handling, Escape and backdrop dismissal). `ModalButton` was removed; call sites now control the dialog with React state.
- [x] Low: Replace the Bootstrap collapse accordions (`src/components/Filter/CardFiltersSection.tsx`, `src/components/Deck/DeckDataCard.tsx`) with native `<details>`. Exclusive `name` is Newly available, so check the fallback first. (guide: accordion) — Done: native `<details>`/`<summary>` with `name="filter-accordion"`; browsers without `name` fall back to allowing several open at once.
- [x] Optional: The `index.html` spinner already has `role="status"` and visually hidden text. Optionally adopt the `<progress aria-label="Loading">` pattern. (guide: spinner) — Kept the spinner: it already announces the loading state, and a bare `<progress>` would need extra styling for no accessibility gain.

### Internationalization
- [x] High: Keep `document.documentElement.lang` in sync with the selected language. Hook it into `src/components/DownloadManager/LanguageSelect.tsx` or `src/i18n.ts`, because `index.html` has a fixed `lang="en"`. (guide: html, accessibility) — Done: `src/i18n.ts` syncs it on init and on `languageChanged`.
- [x] Medium: Move the hard-coded Card strings (see Accessibility) into i18n keys in every locale (en, es, fr, de, it, ko). (code review) — Done for `en` and `es`; the other locales already rely on the `en` fallback.
- [x] Low: `src/components/Card/CardGrid.tsx` imports the global `t` from i18next. Use `useTranslation` instead. (code review)

### Security and privacy
- [x] High: Sanitize HTML rendered with `dangerouslySetInnerHTML` in `src/components/Card/SingleCard/Card.tsx` (lines 170, 179, 201, 209, 219). Use the Sanitizer API `setHTML()`, and load DOMPurify only when native support is missing. (guide: sanitize-untrusted-html) — Done: `SanitizedHtml` uses `setHTML()` and lazy-loads DOMPurify; Card no longer uses `dangerouslySetInnerHTML`.
- [x] Medium: Add `referrerpolicy="no-referrer"` to the CDN `<script>` and `<link>` tags in `index.html`. Add `<meta name="referrer" content="strict-origin-when-cross-origin">` to `<head>`. (guide: secure-external-subresources) — Done.
- [x] Low: Review the translation-string `dangerouslySetInnerHTML` sites in `src/components/DownloadManager/ResetAppButton.tsx` (line 31), `src/components/DownloadManager/Packs/DownloadAllButton.tsx` (line 25), and `src/components/DownloadManager/Packs/RemoveAllButton.tsx` (line 26). Consider react-i18next `Trans`. (code review) — Done: they now use `SanitizedHtml`, so no raw `dangerouslySetInnerHTML` remains.
- [x] Low: Replace the regex that converts `<img>` to markdown in `src/store/entities/decks.ts` (line 62). (code review) — Done: `DOMParser`-based conversion.
- [x] Low: Add `rel="noopener noreferrer"` to the `target="_blank"` image link in `src/components/Card/SingleCard/Card.tsx` (~127), as `src/components/Card/SingleCard/CardTop.tsx` already does. (code review) — Done.
- [x] Low: Review third-party requests: the favicon (`index.html`), the logo (`src/components/DownloadManager/Packs/PacksSection.tsx`), and card images (`src/components/Card/SingleCard/CardImage.tsx`). (code review) — Reviewed: all three point at `marvelcdb.com`, which is the app's data source; the referrer policy above limits what leaks. No change made.

### Performance
- [x] Medium: Add `defer` to the Bootstrap bundle and jQuery scripts in `index.html` (lines 23–29). Use `fetchpriority="low"` on non-critical scripts. (guide: performance, optimize-script-priority) — Obsolete: both scripts were removed from `index.html`.
- [x] Medium: Animate `transform` or `translate` instead of layout properties. `src/App.css` transitions include `margin` (~216), `left` (~226), and `right` (~274). (guide: motion) — Done: panels animate `transform` only and the card-list margin change is instant.
- [x] Low: Set `width` and `height` on the logo in `src/components/DownloadManager/Packs/PacksSection.tsx` (line 35) to avoid layout shift. (code review) — Done: `width={192} height={192}` with CSS sizing.
- [x] Low: Each card renders its own Bootstrap Modal (`src/components/Card/SingleCard/Card.tsx` ~227). Consider one shared dialog. (code review) — Done: `CardGrid` owns a single Astryx dialog and passes `onShowJson`; `Card` keeps its local dialog only when rendered standalone.

### CSS
- [x] Medium: Add the standard `scrollbar-color` and `scrollbar-width` to the scrollable containers. Keep the `::-webkit-scrollbar` rules in `src/App.css` (lines 7–24) as fallbacks, wrapped in `@supports not (scrollbar-color: auto)` so they don't conflict with the standard properties. The idle thumb (#BDBDBD on track #F2F2F2) is about 1.7:1 by hand calculation, below the guide's 3:1 minimum (WCAG 1.4.11). (guide: customize-scrollbar-color-and-thickness) — Done: standard properties added, thumb darkened to `#6E6E6E`, webkit rules wrapped in `@supports not`.
- [x] Medium: Add `<meta name="text-scale" content="scale" />` to `index.html`. `src/App.css` sets font sizes only in `em` on `.mc-card-grid`, not on `html` or `:root`, so it is compatible. (guide: respect-os-text-scale) — Done.
- [x] Low: Change `@import "tailwindcss";` to `@reference "tailwindcss";` in `src/components/Navigation/Navigation.module.css` and `src/components/IconForConcept/IconForConcept.module.css`. This keeps `@apply` working without emitting Tailwind output in each module. Confirm with `npm run build`. (code review) — Done: `@reference` keeps `@apply` working and the build is clean.
- [x] Low: Remove the malformed, unused `--box-shadow` (`src/App.css` ~37) and the duplicated `.shadowed` shadow. (code review) — Done: malformed `--box-shadow` removed; the single `.shadowed` rule is the only shadow definition left.

### Dependencies and tooling
- [x] Medium: After the modal and collapse migrations, remove the Bootstrap JS bundle and jQuery from `index.html`. Keep Bootstrap CSS. Confirm jQuery is unused at runtime first. — Done: no `data-bs-*` usage or jQuery calls remain; both scripts were deleted.
- [x] Medium: Fix the `lint` script in `package.json` (`eslint . --ext ts,tsx ...`). It is likely invalid under the flat config in `eslint.config.js` (ESLint 9). Confirm with `npm run lint`. — Done: `--ext` dropped, config ignores build/coverage/editor folders, and the rule set uses `@typescript-eslint/no-unused-vars`. `eslint-plugin-react` and `@eslint/js` are now explicit dev dependencies (they came transitively from `standard`).
- [x] Low: Remove `moment`. It is only commented out in `src/store/entities/packs.ts` (lines 4 and 194). — Done: dependency and comments removed.
- [x] Low: Remove `@redux-devtools/extension`. Nothing imports it, and `src/store/configureStore.ts` uses `devTools: true`. — Done.
- [x] Low: Remove `autoprefixer` and `postcss` if the build confirms they are unused. There is no PostCSS config, and `vite.config.ts` and `src` do not reference them. — Done: removed; the build still works.
- [x] Low: Remove `standard` if confirmed unused. No script or `src` file references it. Keep `redux` and `reselect`, which `src` imports directly. — Done, with the explicit ESLint packages added above.

### Open decisions
- **Filter and download panel model.** Use a `<dialog>` opened with `showModal()` if they are drawers only, which is the guide's default. Use `role="dialog"` with `popover="manual"` if they also act as a desktop sidebar.
- **Bootstrap JS.** Keep it for the modal and collapses, or migrate those to native `<dialog>` and `<details>` and remove it along with jQuery.
- **Browser target: decided.** You chose Baseline Widely Available, so `closedby`, `command`/`commandfor`, exclusive `details name`, `scrollbar-color`, and the Sanitizer API need the fallbacks from their guides.

### Not verified
- `legacy-scan` ran over `src/` and `index.html`. It covers about 20% of the guides, and its 3 findings are already listed (`src/App.css` lines 7, 16, and 22). The other guide IDs come from local file names. `search` and `retrieve` were not run for them.
- Runtime jQuery use and duplicated Tailwind output need a browser check or an inspection of the `npm run build` output.
- Contrast ratios are hand calculations.
