process.env.JWT_SECRET="secret"
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/test/setup/setupTests.js'],
    globals: {
        "__DEV__": true
    },
    moduleFileExtensions: [
      "js",
      "json"
    ],
    testMatch: [
      "**/test/**/*.test.js"
    ],
    testEnvironment: "node",
  };