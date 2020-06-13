module.exports = {
  preset: "jest-puppeteer",
  globals: {
    URL: "https://sabe.io",
  },
  testMatch: ["**/*.spec.js"],
  verbose: true,
};
