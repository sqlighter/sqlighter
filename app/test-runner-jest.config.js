const { getJestConfig } = require("@storybook/test-runner")

module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */

  /** Test are compiled by Storybook on the spot and may load external data, etc allow extra time */
  testTimeout: 90 * 1000,
}
