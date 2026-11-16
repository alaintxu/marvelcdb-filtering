# AGENTS.md

Guidance for AI agents working in this repository. Make small, surgical changes that match the existing code.

## Project

MarvelCDB Filtering is a static single-page React app. It loads public MarvelCDB data in the browser, caches it, and filters and displays cards and decks. It is deployed to GitHub Pages.

Product behavior and load-reduction rules are in [README.en.md](README.en.md). That README says cards are stored in local storage, but the code stores them in IndexedDB. Follow the code.

## Stack

- React 19, TypeScript 5.9 (strict), Vite 7, Node 22 (CI uses `22.x`).
- Redux Toolkit 2 with react-redux 9, i18next 25 with react-i18next 16, idb-keyval 6, `@draperez/react-components` 2.
- Tailwind CSS 4 via `@tailwindcss/vite`. Bootstrap 5.3 and jQuery 3.7 load from CDN tags in [index.html](index.html), not from `package.json`.
- Jest 30 with ts-jest 29 and jsdom. ESLint 9 flat config in [eslint.config.js](eslint.config.js). `babel-plugin-react-compiler` runs through Vite.

## Commands

Run from the repo root.

```sh
npm i                                                        # install (CI runs this too)
npm run dev                                                  # http://localhost:5173/marvelcdb-filtering/
npm test                                                     # full Jest suite: 12 suites, 141 tests, about 16 s
npx jest src/tests/packs.spec.ts                             # single spec file
npx tsc --noEmit                                             # typecheck; npm run build runs tsc first
npx eslint src/App.tsx                                       # lint the files you changed
npx vite build --outDir /tmp/marvelcdb-build --emptyOutDir   # production build outside the repo
```

- `npm run build` writes to `marvelcdb-filtering/`, which is gitignored. Use the `--outDir` form above to check the build without touching that folder.
- `npm run lint` already fails with about 5,300 problems. Don't fix unrelated lint errors. Lint only the files you change.
- The [ESLint config](eslint.config.js) ignores only `dist`, `node_modules`, and `.eslintrc.cjs`. It doesn't exclude the gitignored `marvelcdb-filtering/` build folder or `.vscode/`.

## Layout

- `src/store/`: Redux Toolkit store.
  - `api.ts` defines `apiCallBegan`. `middleware/api.ts` makes the only live fetch.
  - `entities/` holds entity slices, for example `decks.ts`. `ui/` holds UI state, such as filters.
  - `persistence/cardsDb.ts` is the IndexedDB card cache.
- `src/hooks/`: `useStore.ts` exports the typed Redux hooks. `useDataQuery.ts` and `usePacksQuery.ts` are commented out, so don't import them.
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
- `en` is the fallback language (`fallbackLng` in [i18n.ts](src/i18n.ts)). Add new keys to `en`. `de`, `fr`, `it`, and `ko` only have the `global`, `modal`, and `multiselect_filter` namespaces.
- `base_path` in `global.json` differs by language: `https://marvelcdb.com` for `en`, `https://<lang>.marvelcdb.com` for the others. Changing the language also changes the data source.
- [Card.tsx](src/components/Card/SingleCard/Card.tsx) has hard-coded Spanish strings. It is a known exception. Don't copy that pattern.

UI and styling:
- Modals and collapses use Bootstrap `data-bs-*` attributes, handled by Bootstrap's JS rather than React state. Check [ToDo.md](ToDo.md) before adding more, since the panel model is an open decision.
- Tailwind is imported per CSS Module with `@import "tailwindcss";`, as in [Navigation.module.css](src/components/Navigation/Navigation.module.css). Global styles go in [App.css](src/App.css).
- `Card.tsx` already uses `dangerouslySetInnerHTML`. Don't add new uses without sanitizing the input.
- Browser support is Baseline Widely Available. Features outside it need the fallbacks their Modern Web Guidance guides specify. Vite's default build target is `baseline-widely-available`, and [vite.config.ts](vite.config.ts) doesn't override it.
- For UI, CSS, or client-side JS changes, search and retrieve Modern Web Guidance guides first, as described in [SKILL.md](.agents/skills/modern-web-guidance/SKILL.md). The skill is vendored and pinned in [skills-lock.json](skills-lock.json). Don't edit it.

Testing:
- Jest runs in jsdom through ts-jest. [jest.config.js](jest.config.js) maps CSS and image imports to `src/tests/mocks/`.
- `setupTests.ts` installs the localStorage mock and polyfills `structuredClone` for fake-indexeddb.
- Render components with `createRoot` from `react-dom/client`. No `@testing-library` packages are installed, so follow the same pattern.
- Specs that mock network calls set up `jest-fetch-mock` in `beforeEach` with `fetchMock.resetMocks(); fetchMock.enableMocks();`.
- `cardImageRetry.spec.tsx` queries Spanish labels, so changing those strings can break it.
- The `transform` pattern in `jest.config.js` is a plain string literal, so `\.` becomes `.`. Write `\\.` or use `String.raw` when you edit it.

CI and deploy:
- [tests.yml](.github/workflows/tests.yml) runs Jest on push and pull requests. Its Jest step sets `continue-on-error: true`, so a red run doesn't fail that workflow. Run `npm test` yourself before you finish.
- [pages.yml](.github/workflows/pages.yml) builds with `npm run build` after the Test npm workflow succeeds on `main` or `master`, then deploys the `marvelcdb-filtering/` folder.
- `base` (`/marvelcdb-filtering`) and `build.outDir` in [vite.config.ts](vite.config.ts) affect the Pages URL, the artifact path in `pages.yml`, and the local dev URL. Ask before changing either.
- [jest-results.json](jest-results.json) is tracked CI output. Don't edit it by hand.

Git:
- Don't commit or push unless the user asks. Don't stage or unstage files you didn't change.
- Commit subjects often use conventional prefixes (`feat`, `fix`, `refactor`, `chore`). That isn't enforced, and some subjects are in Spanish.
- End agent-made commits with `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.

Before you finish:
- Run `npm test` after logic changes, `npx tsc --noEmit` after TypeScript changes, and `npx eslint` on the files you changed.
- For UI changes, check the result in `npm run dev`.

Known issues:
- Known issues and the Modern Web Guidance audit are listed in [ToDo.md](ToDo.md). Don't fix them as side effects of unrelated changes.
