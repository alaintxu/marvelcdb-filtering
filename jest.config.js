/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    "\.(css|less|scss|sass)$": "<rootDir>/src/tests/mocks/styleMock.ts",
    "\.(png|jpe?g|gif|webp|svg|avif)$": "<rootDir>/src/tests/mocks/fileMock.ts",
  },
  setupFiles: ["<rootDir>/src/tests/setupTests.ts"],
  // setupFilesAfterEnv: ["jest-fetch-mock"],
  // setupFilesAfterEach: ["jest-localstorage-mock"],
};