# ToDo

## My ToDos
- [ ] Remove Bootstrap need as we are using Tailwind, try to use it instead of Bootstrap.
- [ ] Check if we can use https://astryx.atmeta.com/components components for the project. Is that interesting?
- [ ] Can the user experience be improved when cards are being loaded? Can that loading be faster? Do we have Skeletons in the cards for when they are loading? Do we need them?
- [ ] Can selected decks be exported? Is enough with the deck id?

## Modern Web Guidance audit

### Accessibility
- [ ] High: Make closed filter and download panels `inert` while closed. They are hidden only by `transform` (`src/App.css` ~225), so their controls stay in the tab order and accessibility tree. Do not add `inert` to a native modal. (guide: html, dialog)
- [ ] High: Add `aria-expanded` and `aria-controls` to the navigation panel toggles (`src/components/Navigation/Navigation.tsx`). (guide: navigation-drawer)
- [ ] High: Add Escape to close the filter and download panels. They currently close only on outside `mousedown` (`src/components/MainLayout.tsx` ~100–115). Settle the panel model first (see open decisions). (guide: navigation-drawer)
- [ ] High: Respect `prefers-reduced-motion`. Keep opacity changes, and remove spatial motion under `reduce`: card flip (`src/App.css` ~136–152) and panel slides (~226, ~274). Do not use a global `animation-duration: 0.01ms`. The project has no reduced-motion query today. (guide: motion)
- [ ] Medium: Translate hard-coded accessible names: `src/components/Card/SingleCard/Card.tsx` (lines 128, 136–137, 142, 151, 184), `src/components/Navigation/Navigation.tsx` (53), `src/components/DownloadManager/Decks/DeckList.tsx` (34), `src/components/DownloadManager/Decks/DeckSection.tsx` (93), `src/components/DownloadManager/Packs/PacksSection.tsx` (69). Update the Spanish queries in `src/tests/cardImageRetry.spec.tsx`. (code review)
- [ ] Medium: Fix icon-only controls in `src/components/Filter/QuickSearchFilter.tsx`. Give the clear button a translated `aria-label`. Add `aria-hidden="true"` to decorative icons, since react-icons renders an unnamed `<svg>` by default (`src/components/IconForConcept/IconForConcept.tsx`). Change the input to `type="search"` and check for a second native clear button. (guide: icons, forms)
- [ ] Medium: Replace the Bootstrap modal (`src/components/Modal/Modal.tsx`, `src/components/Modal/ModalButton.tsx`) with a native `<dialog>` opened with `showModal()`. Use `command="show-modal"` only if the target includes Invoker commands. Remove `role="dialog"`, `aria-modal`, and `aria-hidden`. If you use `closedby`, add the light-dismiss fallback. (guide: dialog, light-dismiss-a-dialog)
- [ ] Low: Replace the Bootstrap collapse accordions (`src/components/Filter/CardFiltersSection.tsx`, `src/components/Deck/DeckDataCard.tsx`) with native `<details>`. Exclusive `name` is Newly available, so check the fallback first. (guide: accordion)
- [ ] Optional: The `index.html` spinner already has `role="status"` and visually hidden text. Optionally adopt the `<progress aria-label="Loading">` pattern. (guide: spinner)

### Internationalization
- [ ] High: Keep `document.documentElement.lang` in sync with the selected language. Hook it into `src/components/DownloadManager/LanguageSelect.tsx` or `src/i18n.ts`, because `index.html` has a fixed `lang="en"`. (guide: html, accessibility)
- [ ] Medium: Move the hard-coded Card strings (see Accessibility) into i18n keys in every locale (en, es, fr, de, it, ko). (code review)
- [ ] Low: `src/components/Card/CardGrid.tsx` imports the global `t` from i18next. Use `useTranslation` instead. (code review)

### Security and privacy
- [ ] High: Sanitize HTML rendered with `dangerouslySetInnerHTML` in `src/components/Card/SingleCard/Card.tsx` (lines 170, 179, 201, 209, 219). Use the Sanitizer API `setHTML()`, and load DOMPurify only when native support is missing. (guide: sanitize-untrusted-html)
- [ ] Medium: Add `referrerpolicy="no-referrer"` to the CDN `<script>` and `<link>` tags in `index.html`. Add `<meta name="referrer" content="strict-origin-when-cross-origin">` to `<head>`. (guide: secure-external-subresources)
- [ ] Low: Review the translation-string `dangerouslySetInnerHTML` sites in `src/components/DownloadManager/ResetAppButton.tsx` (line 31), `src/components/DownloadManager/Packs/DownloadAllButton.tsx` (line 25), and `src/components/DownloadManager/Packs/RemoveAllButton.tsx` (line 26). Consider react-i18next `Trans`. (code review)
- [ ] Low: Replace the regex that converts `<img>` to markdown in `src/store/entities/decks.ts` (line 62). (code review)
- [ ] Low: Add `rel="noopener noreferrer"` to the `target="_blank"` image link in `src/components/Card/SingleCard/Card.tsx` (~127), as `src/components/Card/SingleCard/CardTop.tsx` already does. (code review)
- [ ] Low: Review third-party requests: the favicon (`index.html`), the logo (`src/components/DownloadManager/Packs/PacksSection.tsx`), and card images (`src/components/Card/SingleCard/CardImage.tsx`). (code review)

### Performance
- [ ] Medium: Add `defer` to the Bootstrap bundle and jQuery scripts in `index.html` (lines 23–29). Use `fetchpriority="low"` on non-critical scripts. (guide: performance, optimize-script-priority)
- [ ] Medium: Animate `transform` or `translate` instead of layout properties. `src/App.css` transitions include `margin` (~216), `left` (~226), and `right` (~274). (guide: motion)
- [ ] Low: Set `width` and `height` on the logo in `src/components/DownloadManager/Packs/PacksSection.tsx` (line 35) to avoid layout shift. (code review)
- [ ] Low: Each card renders its own Bootstrap Modal (`src/components/Card/SingleCard/Card.tsx` ~227). Consider one shared dialog. (code review)

### CSS
- [ ] Medium: Add the standard `scrollbar-color` and `scrollbar-width` to the scrollable containers. Keep the `::-webkit-scrollbar` rules in `src/App.css` (lines 7–24) as fallbacks, wrapped in `@supports not (scrollbar-color: auto)` so they don't conflict with the standard properties. The idle thumb (#BDBDBD on track #F2F2F2) is about 1.7:1 by hand calculation, below the guide's 3:1 minimum (WCAG 1.4.11). (guide: customize-scrollbar-color-and-thickness)
- [ ] Medium: Add `<meta name="text-scale" content="scale" />` to `index.html`. `src/App.css` sets font sizes only in `em` on `.mc-card-grid`, not on `html` or `:root`, so it is compatible. (guide: respect-os-text-scale)
- [ ] Low: Change `@import "tailwindcss";` to `@reference "tailwindcss";` in `src/components/Navigation/Navigation.module.css` and `src/components/IconForConcept/IconForConcept.module.css`. This keeps `@apply` working without emitting Tailwind output in each module. Confirm with `npm run build`. (code review)
- [ ] Low: Remove the malformed, unused `--box-shadow` (`src/App.css` ~37) and the duplicated `.shadowed` shadow. (code review)

### Dependencies and tooling
- [ ] Medium: After the modal and collapse migrations, remove the Bootstrap JS bundle and jQuery from `index.html`. Keep Bootstrap CSS. Confirm jQuery is unused at runtime first.
- [ ] Medium: Fix the `lint` script in `package.json` (`eslint . --ext ts,tsx ...`). It is likely invalid under the flat config in `eslint.config.js` (ESLint 9). Confirm with `npm run lint`.
- [ ] Low: Remove `moment`. It is only commented out in `src/store/entities/packs.ts` (lines 4 and 194).
- [ ] Low: Remove `@redux-devtools/extension`. Nothing imports it, and `src/store/configureStore.ts` uses `devTools: true`.
- [ ] Low: Remove `autoprefixer` and `postcss` if the build confirms they are unused. There is no PostCSS config, and `vite.config.ts` and `src` do not reference them.
- [ ] Low: Remove `standard` if confirmed unused. No script or `src` file references it. Keep `redux` and `reselect`, which `src` imports directly.

### Open decisions
- **Filter and download panel model.** Use a `<dialog>` opened with `showModal()` if they are drawers only, which is the guide's default. Use `role="dialog"` with `popover="manual"` if they also act as a desktop sidebar.
- **Bootstrap JS.** Keep it for the modal and collapses, or migrate those to native `<dialog>` and `<details>` and remove it along with jQuery.
- **Browser target: decided.** You chose Baseline Widely Available, so `closedby`, `command`/`commandfor`, exclusive `details name`, `scrollbar-color`, and the Sanitizer API need the fallbacks from their guides.

### Not verified
- `legacy-scan` ran over `src/` and `index.html`. It covers about 20% of the guides, and its 3 findings are already listed (`src/App.css` lines 7, 16, and 22). The other guide IDs come from local file names. `search` and `retrieve` were not run for them.
- Runtime jQuery use and duplicated Tailwind output need a browser check or an inspection of the `npm run build` output.
- Contrast ratios are hand calculations.
