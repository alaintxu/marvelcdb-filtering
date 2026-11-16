# AGENTS.md

Guidance for AI agents working in this repository. Make small, surgical changes that match the existing code.

## Project

MarvelCDB Filtering is a static single-page React app. It loads public MarvelCDB data in the browser, caches it, and filters and displays cards and decks. It is deployed to GitHub Pages.

Product behavior and load-reduction rules are in [README.en.md](README.en.md). That README says cards are stored in local storage, but the code stores them in IndexedDB. Follow the code.

## Stack

- React 19, TypeScript 5.9 (strict), Vite 8, Node 22 for CI parity (Vite 8 needs Node `^20.19` or `>=22.12`). Bun 1.4 is the package manager and `bun.lock` is the only lockfile.
- Redux Toolkit 2 with react-redux 9, i18next 25 with react-i18next 16, idb-keyval 6.
- Astryx (`@astryxdesign/core` 0.7.x with `@astryxdesign/theme-neutral`) is the component library. Its CSS is imported in [App.css](src/App.css) and the app root is wrapped in `<Theme>`. Import Astryx components from their own entry, for example `@astryxdesign/core/Button`.
- StyleX (`@stylexjs/stylex` 0.19) is the styling layer. `@stylexjs/unplugin` compiles it in Vite; there is no Tailwind, Bootstrap, or jQuery left. `@stylexjs/babel-plugin` compiles it for Jest.
- Jest 30 with babel-jest and jsdom. ESLint 9 flat config in [eslint.config.js](eslint.config.js). React Compiler runs through `@vitejs/plugin-react`'s `compiler: true` option, which needs the `oxc-transform-react` dev dependency; there is no Babel pass in the Vite pipeline (Jest has its own Babel transform).

## Commands

Run from the repo root.

```sh
bun install                                                    # install (CI runs `bun install --frozen-lockfile`)
bun run dev                                                    # http://localhost:5173/marvelcdb-filtering/
bun test                                                       # full Jest suite: 14 suites, 147 tests, about 20 s
bunx jest src/tests/packs.spec.ts                              # single spec file
bunx tsc --noEmit                                              # typecheck; bun run build runs tsc first
bunx eslint src/App.tsx                                        # lint the files you changed
bunx vite build --outDir /tmp/marvelcdb-build --emptyOutDir    # production build outside the repo
```

- `bun run build` writes to `marvelcdb-filtering/`, which is gitignored. Use the `--outDir` form above to check the build without touching that folder.
- `bun run lint` reports pre-existing problems and therefore exits non-zero. Don't fix unrelated lint errors. Lint only the files you change.
- The [ESLint config](eslint.config.js) ignores `dist`, `node_modules`, `.eslintrc.cjs`, the gitignored `marvelcdb-filtering/` build folder, `coverage/`, and `.vscode/`.
- When an agent wants to test the app (e.g. using Playwright), when running `bun run dev`, use a different port (e.g. 5175 or better, use a random number) so it has no conflicts with the user (they may be testing on their own). Note that background browser tabs pause CSS transitions, so read end states with animations disabled.

## Layout

- `src/store/`: Redux Toolkit store.
  - `api.ts` defines `apiCallBegan`. `middleware/api.ts` makes the only live fetch.
  - `entities/` holds entity slices, for example `decks.ts`. `ui/` holds UI state, such as filters.
  - `persistence/cardsDb.ts` is the IndexedDB card cache.
- `src/hooks/`: `useStore.ts` exports the typed Redux hooks. `useDataQuery.ts` and `usePacksQuery.ts` are commented out, so don't import them.
- `src/styles/`: StyleX building blocks (`ui.ts`), brand tokens (`tokens.css` + `tokens.stylex.ts`), deck aspect tones (`aspects.ts`), and the `cx` class-name joiner.
- `src/components/`: React components, grouped by feature (`Card`, `Deck`, `Filter`, `Modal`, `DownloadManager`, `Navigation`). [MainLayout.tsx](src/components/MainLayout.tsx) lays out the page.
- `src/i18n.ts` and `src/locales/<lang>/<namespace>.json`: translations.
- [LocalStorageHelpers.ts](src/LocalStorageHelpers.ts): localStorage access.
- `src/tests/`: Jest specs, mocks, and [setupTests.ts](src/tests/setupTests.ts).

## Conventions

Data and state:
- Fetch remote data by dispatching `apiCallBegan` from [api.ts](src/store/api.ts). Don't call `fetch` from components. The middleware in `src/store/middleware/api.ts` makes the request and dispatches the success or failure actions.
- Use `useAppDispatch` and `useAppSelector` from [useStore.ts](src/hooks/useStore.ts). Don't import `useDispatch` or `useSelector` from react-redux.
- Cards are cached in IndexedDB under `pack:<lang>:<packCode>`. Changing `SCHEMA_VERSION` in [cardsDb.ts](src/store/persistence/cardsDb.ts) clears every cached pack on the next access. Change it only on purpose.
- Small state, such as selected packs, decks, and pagination, goes in localStorage through [LocalStorageHelpers.ts](src/LocalStorageHelpers.ts).

Translations:
- `en` is the fallback language (`fallbackLng` in [i18n.ts](src/i18n.ts)). Only `en` and `es` have translated namespaces; `de`, `fr`, `it`, and `ko` fall back to `en`. [i18n.ts](src/i18n.ts) also mirrors the active language to `document.documentElement.lang`. Add new keys to `en`. `de`, `fr`, `it`, and `ko` only have the `global`, `modal`, and `multiselect_filter` namespaces.
- `base_path` in `global.json` differs by language: `https://marvelcdb.com` for `en`, `https://<lang>.marvelcdb.com` for the others. Changing the language also changes the data source.
- [Card.tsx](src/components/Card/SingleCard/Card.tsx) has hard-coded Spanish strings. It is a known exception. Don't copy that pattern.

UI and styling:
- Modals use the Astryx `Dialog` through [Modal.tsx](src/components/Modal/Modal.tsx) and are controlled with React state: pass `isOpen` and `onOpenChange`. Accordions and collapsibles are native `<details>`/`<summary>` (filters use `name="filter-accordion"` for exclusivity). The filter and download panels are closed by outside click or Escape, and the closed panel gets `inert`; keep that wiring when touching [MainLayout.tsx](src/components/MainLayout.tsx) or [Navigation.tsx](src/components/Navigation/Navigation.tsx). Panels and the navigation carry `data-panel` attributes; the outside-click handler in `MainLayout` matches that attribute, not class names.
- Styling is StyleX. Shared building blocks live in [ui.ts](src/styles/ui.ts) and are composed with `stylex.props(...)`. Brand values are CSS custom properties in [tokens.css](src/styles/tokens.css), exposed to components as StyleX variables from [tokens.stylex.ts](src/styles/tokens.stylex.ts); change colours and type there, not per component. Global and animation-heavy CSS stays in [App.css](src/App.css). App-specific hooks such as `mc-card`, `mc-details`, and `mc-card__content` are plain class names; when merging one with StyleX, join `stylex.props(...).className` instead of letting the spread overwrite it (see [cx.ts](src/styles/cx.ts)).
- Do not add Bootstrap or Tailwind classes. `.stylex.ts` files are reserved for `stylex.defineVars`/`createTheme`: a `stylex.create` module with a `.stylex.ts` name makes the compiler treat it as a theme file and fail on ordinary imports.
- Untrusted HTML (card text and flavor from the API) goes through [SanitizedHtml](src/components/SanitizedHtml/SanitizedHtml.tsx), which uses the Sanitizer API's `setHTML()` and lazy-loads DOMPurify when it is missing. Don't add `dangerouslySetInnerHTML` for API or user data.
- Browser support is Baseline Widely Available. Features outside it need the fallbacks their Modern Web Guidance guides specify. Vite's default build target is `baseline-widely-available`, and [vite.config.ts](vite.config.ts) doesn't override it.
- For UI, CSS, or client-side JS changes, search and retrieve Modern Web Guidance guides first, as described in [SKILL.md](.agents/skills/modern-web-guidance/SKILL.md). The skill is vendored and pinned in [skills-lock.json](skills-lock.json). Don't edit it.

Testing:
- Jest runs in jsdom. Babel handles TS/TSX so the StyleX plugin sees its imports before TypeScript strips them; `bunx tsc --noEmit` is the type check. [jest.config.js](jest.config.js) maps CSS and image imports to `src/tests/mocks/`.
- `setupTests.ts` installs the localStorage mock and polyfills `structuredClone` for fake-indexeddb.
- Render components with `createRoot` from `react-dom/client`. No `@testing-library` packages are installed, so follow the same pattern.
- Specs that mock network calls set up `jest-fetch-mock` in `beforeEach` with `fetchMock.resetMocks(); fetchMock.enableMocks();`.
- `cardImageRetry.spec.tsx` queries Spanish labels, so changing those strings can break it.
- The `transform` pattern in `jest.config.js` is a plain string literal, so `\.` becomes `.`. Write `\\.` or use `String.raw` when you edit it.
- StyleX's Babel plugin needs `unstable_moduleResolution: { type: "commonJS", rootDir: process.cwd() }` in Jest (and in `vite.config.ts`) to resolve variables imported from [tokens.stylex.ts](src/styles/tokens.stylex.ts).

CI and deploy:
- [tests.yml](.github/workflows/tests.yml) ("Test bun") runs Jest on push and pull requests with `oven-sh/setup-bun` and `bun install --frozen-lockfile`. Its Jest step sets `continue-on-error: true`, so a red run doesn't fail that workflow. Run `bun test` yourself before you finish.
- [pages.yml](.github/workflows/pages.yml) ("Build bun") builds with `bun run build` after "Test bun" succeeds on `main` or `master`, then deploys the `marvelcdb-filtering/` folder. Renaming either workflow means updating the `workflow_run` name in `pages.yml`.
- `base` (`/marvelcdb-filtering`) and `build.outDir` in [vite.config.ts](vite.config.ts) affect the Pages URL, the artifact path in `pages.yml`, and the local dev URL. Ask before changing either.
- [jest-results.json](jest-results.json) is tracked CI output. Don't edit it by hand.

Git:
- Don't commit or push unless the user asks. Don't stage or unstage files you didn't change.
- Commit subjects often use conventional prefixes (`feat`, `fix`, `refactor`, `chore`). That isn't enforced, and some subjects are in Spanish.
- End agent-made commits with `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.

Before you finish:
- Run `bun test` after logic changes, `bunx tsc --noEmit` after TypeScript changes, and `bunx eslint` on the files you changed.
- For UI changes, check the result in `bun run dev`.

Known issues:
- Known issues and the Modern Web Guidance audit are listed in [ToDo.md](ToDo.md). Don't fix them as side effects of unrelated changes.
