/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.paths.json';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "tests/coverage",
  coverageProvider: "v8",
  moduleDirectories: [ "node_modules", "<rootDir>" ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePathIgnorePatterns: [ "<rootDir>/tests/mocks/" ],
  preset: "ts-jest",
  setupFiles: [ "./jest.setup.ts" ],
  verbose: true,
};

export default config;
