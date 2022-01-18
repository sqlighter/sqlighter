export default {
    // An array of file extensions your modules use
    moduleFileExtensions: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "node"
    ],
    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: [
      "/node_modules/",
      "/build/"
    ],
    // A preset that is used as a base for Jest's configuration
    preset: 'ts-jest',  
    // long timeout
    testTimeout: 60 * 1000
  };

  