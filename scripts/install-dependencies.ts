import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// First, install system dependencies for canvas and other packages
const installSystemDependencies = () => {
  try {
    console.log('📦 Installing system dependencies...');
    execSync('sudo apt-get update && sudo apt-get install -y \
      build-essential \
      libcairo2-dev \
      libpango1.0-dev \
      libjpeg-dev \
      libgif-dev \
      librsvg2-dev \
      pkg-config', 
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.warn('⚠️ Could not install system dependencies. You may need to install them manually.');
  }
};

const dependencies = {
  // Core dependencies with known working versions
  main: [
    'canvas@2.10.2', // Using older version for better compatibility
    'sharp@0.31.3',
    'winston@3.8.2',
    'date-fns@2.29.3'
  ],
  // ML dependencies
  ml: [
    '@tensorflow/tfjs-node@4.10.0',
    '@tensorflow-models/mobilenet@2.1.0',
    'ml-matrix@6.10.4',
    'ml-random-forest@2.1.0',
    'onnxruntime-node@1.14.0',
    'mathjs@11.8.2'
  ],
  // Build dependencies
  build: [
    '@rollup/plugin-commonjs@24.1.0',
    '@rollup/plugin-json@6.0.0',
    '@rollup/plugin-node-resolve@15.0.2',
    '@rollup/plugin-terser@0.4.3',
    '@rollup/plugin-typescript@11.1.0',
    'rollup@3.21.0',
    'rollup-plugin-dts@5.3.0',
    'rollup-plugin-visualizer@5.9.0'
  ],
  // TypeScript and types
  typescript: [
    'typescript@5.0.4',
    'tslib@2.5.0',
    'ts-node@10.9.1',
    'ts-node-dev@2.0.0',
    '@types/node@18.16.3',
    '@types/jest@29.5.1',
    '@types/benchmark@2.1.2',
    '@types/node'
  ],
  // Testing
  testing: [
    'jest@29.5.0',
    'ts-jest@29.1.0',
    'benchmark@2.1.4'
  ],
  // Linting and formatting
  linting: [
    'eslint@8.39.0',
    '@typescript-eslint/eslint-plugin@5.59.2',
    '@typescript-eslint/parser@5.59.2',
    'prettier@2.8.8',
    'eslint-config-prettier@8.8.0',
    'eslint-plugin-prettier@4.2.1'
  ],
  // Development tools
  tools: [
    'husky@8.0.3',
    'lint-staged@13.2.2',
    'rimraf@5.0.0',
    'typedoc@0.24.7'
  ]
};

async function installDependencies() {
  try {
    console.log('🚀 Starting dependency installation...');

    // Install system dependencies first
    installSystemDependencies();

    // Clean existing installations
    console.log('🧹 Cleaning existing installations...');
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });

    // Create temporary package.json with exact versions
    const packageJson = {
      name: "@obinexuscomputing/guardian",
      version: "1.0.0",
      main: "dist/index.js",
      module: "dist/index.mjs",
      types: "dist/index.d.ts",
      files: ["dist"],
      scripts: {
        "postinstall": "node scripts/install-dependencies.js",
        "build": "rollup -c",
        "test": "jest",
        "lint": "eslint . --ext .ts",
        "format": "prettier --write \"src/**/*.ts\""
      },
      dependencies: {},
      devDependencies: {},
      engines: {
        "node": ">=16.0.0",
        "npm": ">=8.0.0"
      }
    };

    // Add exact versions to package.json
    for (const dep of dependencies.main) {
      const [name, version] = dep.split('@');
      packageJson.dependencies[name] = version;
    }
    
    for (const dep of [...dependencies.ml]) {
      const [name, version] = dep.split('@');
      packageJson.dependencies[name] = version;
    }

    for (const dep of [
      ...dependencies.build,
      ...dependencies.typescript,
      ...dependencies.testing,
      ...dependencies.linting,
      ...dependencies.tools
    ]) {
      const [name, version] = dep.split('@');
      packageJson.devDependencies[name] = version;
    }

    // Write temporary package.json
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Install dependencies with legacy peer deps flag and force
    console.log('📦 Installing dependencies...');
    execSync('npm install --legacy-peer-deps --force', { stdio: 'inherit' });

    // Setup git hooks
    console.log('🪝 Setting up git hooks...');
    try {
      execSync('npm run prepare', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Could not setup git hooks. You may need to run npm run prepare manually.');
    }

    console.log('✅ All dependencies installed successfully!');

    // Write installation log
    const log = `Installation completed at ${new Date().toISOString()}\n`;
    writeFileSync('install.log', log, { flag: 'a' });

  } catch (error) {
    console.error('❌ Error installing dependencies:', error);
    process.exit(1);
  }
}

// Run installation
installDependencies();