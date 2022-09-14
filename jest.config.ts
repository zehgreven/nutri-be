import type { Config } from 'jest';
import { resolve } from 'path';
const root = resolve(__dirname);

const config: Config = {
  rootDir: root,
  displayName: 'unit-tests',
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  // COVERAGE
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/src/*',
    '<rootDir>/src/generated/',
    '<rootDir>/src/controllers/',
    '<rootDir>/src/repositories/',
  ],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};

export default config;
