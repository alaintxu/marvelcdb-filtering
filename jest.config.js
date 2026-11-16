/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{}],
    "^.+\\.(js|mjs)$": ["babel-jest", {
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    }],
  },
  // Astryx ships ESM-only builds, so they must go through babel-jest
  transformIgnorePatterns: ["/node_modules/(?!(@astryxdesign|@stylexjs|intl-messageformat|@formatjs)/)"],
  moduleNameMapper: {
    "\.(css|less|scss|sass)$": "<rootDir>/src/tests/mocks/styleMock.ts",
    "\.(png|jpe?g|gif|webp|svg|avif)$": "<rootDir>/src/tests/mocks/fileMock.ts",
  },
  setupFiles: ["<rootDir>/src/tests/setupTests.ts"],
  // setupFilesAfterEnv: ["jest-fetch-mock"],
  // setupFilesAfterEach: ["jest-localstorage-mock"],
};