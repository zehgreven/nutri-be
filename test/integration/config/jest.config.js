/* eslint-disable */
const { resolve } = require('path');
const root = resolve(__dirname) + '/../../../';
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  rootDir: root,
  displayName: 'integration-tests',
  setupFilesAfterEnv: ['<rootDir>/test/integration/config/jest-setup.ts'],
  testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
};
