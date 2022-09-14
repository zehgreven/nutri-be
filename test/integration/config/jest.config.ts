import type { Config } from 'jest';
import { resolve } from 'path';
import rootConfig from '../../../jest.config';

const root = resolve(__dirname) + '/../../../';

const config: Config = {
  ...rootConfig,
  rootDir: root,
  displayName: 'integration-tests',
  setupFilesAfterEnv: ['<rootDir>/test/integration/config/jest-setup.ts'],
  testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/controllers/**'],
  coveragePathIgnorePatterns: [],
};

export default config;
