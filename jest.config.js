process.env.JWT_SECRET="secret"
module.exports = {
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