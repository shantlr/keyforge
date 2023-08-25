/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '@/lib/(.*)$': ['<rootDir>/src/lib/$1'],
  },
};
