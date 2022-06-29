const path = require('path')

/**
 * @typedef {import('webpack').Configuration} Configuration
 */

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: "@storybook/html",
  /**
   * 
   * @param {Configuration} config 
   * @returns {Promise<Configuration>}
   */
  webpackFinal: async (config) => {
    config.resolve.alias['@base'] = path.resolve(process.cwd(), 'src')
    config.resolve.alias['@type'] = path.resolve(process.cwd(), 'types')
    return config
  }
}