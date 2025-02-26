/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  setupFiles: ["<rootDir>/src/store/tests/setupTests.ts"],
  setupFilesAfterEnv: ["jest-fetch-mock"],
};