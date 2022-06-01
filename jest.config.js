// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__test__/global-hook.spec.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['dist', 'hook', 'tools'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@app/entity/(.*)$': '<rootDir>/libs/entity/$1',
    '^@app/common/(.*)$': '<rootDir>/libs/common/$1',
    '^@app/util/(.*)$': '<rootDir>/libs/util/$1',
    '^@test/(.*)$': '<rootDir>/__test__/$1',
    '^@tools/(.*)$': '<rootDir>/__test__/tools/$1',
  },
};
