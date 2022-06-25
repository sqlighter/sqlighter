module.exports = {
  // for some reason if you remove this empty configuration file
  // bookmarksactivity.test.tsx will complain about react not being
  // found whereas if you leave this in, jest complains having double
  // configuration files

  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        filename: "test-report.html",
      },
    ],
  ],
}
