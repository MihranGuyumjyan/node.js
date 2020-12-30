process.env.JWT_SECRET="secret"
process.env.SENDGRID_API_KEY="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"
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