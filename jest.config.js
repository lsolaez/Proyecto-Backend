require('dotenv').config();

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
  ],
};

