/** @type {import('jest').Config} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    // Babel runs before any TypeScript stripping so the StyleX plugin still sees
    // its imports. Type checking is `tsc --noEmit`, not Jest.
    "^.+\\.[cm]?[jt]sx?$": ["babel-jest", {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
      ],
      plugins: [["@stylexjs/babel-plugin", {
        dev: false,
        test: true,
        runtimeInjection: false,
        unstable_moduleResolution: { type: "commonJS", rootDir: process.cwd() },
      }]],
    }],
  },
  // Astryx ships ESM-only builds, so they must go through babel-jest
  transformIgnorePatterns: ["/node_modules/(?!(@astryxdesign|@stylexjs|intl-messageformat|@formatjs)/)"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/tests/mocks/styleMock.ts",
    "\\.(png|jpe?g|gif|webp|svg|avif)$": "<rootDir>/src/tests/mocks/fileMock.ts",
  },
  setupFiles: ["<rootDir>/src/tests/setupTests.ts"],
};
