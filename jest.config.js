module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/config/**'
  ],
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.js'],
  testTimeout: 10000,
  verbose: true
};