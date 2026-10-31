const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: 'node',
    transform: {
        ...tsJestTransformCfg
    },
    setupFilesAfterEnv: ['./src/jest/setupTests.ts'],

    // 1. Ignora la carpeta dist para evitar importar modelos duplicados o antiguos
    modulePathIgnorePatterns: ['<rootDir>/dist/'],

    // 2. Asegura que los tests se busquen únicamente en src/
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'
    ]
};
