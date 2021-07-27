module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!@hexlet/.*)',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
