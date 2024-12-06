import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const dependencies = {
  // Core dependencies
  main: [
    'canvas@2.11.2',
    'sharp@0.32.6',
    'winston@3.11.0',
    'date-fns@2.30.0'
  ],
  // ML dependencies
  ml: [
    '@tensorflow/tfjs-node@4.15.0',
    '@tensorflow-models/mobilenet@2.1.1',
    'ml-matrix@6.10.7',
    'ml-random-forest@2.1.0',
    'onnxruntime-node@1.16.3',
    'mathjs@12.2.1'
  ],
  // Build dependencies
  build: [
    '@rollup/plugin-commonjs@25.0.7',
    '@rollup/plugin-json@6.0.1',
    '@rollup/plugin-node-resolve@15.2.3',
    '@rollup/plugin-terser@0.4.4',
    '@rollup/plugin-typescript@11.1.5',
    'rollup@4.9.2',
    'rollup-plugin-dts@6.1.0',
    'rollup-plugin-visualizer@5.12.0'
  ],
  // TypeScript and types
  typescript: [
    'typescript@5.3.3',
    'tslib@2.6.2',
    'ts-node@10.9.2',
    'ts-node-dev@2.0.0',
    '@types/node@20.10.5',
    '@types/jest@29.5.11',
    '@types/sharp@0.32.0',
    '@types/benchmark@2.1.5'
  ],
  // Testing
  testing: [
    'jest@29.7.0',
    'ts-jest@29.1.1',
    'benchmark@2.1.4'
  ],
  // Linting and formatting
  linting: [
    'eslint@8.56.0',
    '@typescript-eslint/eslint-plugin@6.16.0',
    '@typescript-eslint/parser@6.16.0',
    'prettier@3.1.1',
    'eslint-config-prettier@9.1.0',
    'eslint-plugin-prettier@5.1.2'
  ],
  // Development tools
  tools: [
    'husky@8.0.3',
    'lint-staged@15.2.0',
    'rimraf@5.0.5',
    'typedoc@0.25.4'
  ]
};

async function installDependencies() {
  try {
    console.log('🚀 Starting dependency installation...');

    // Clean existing installations
    console.log('🧹 Cleaning existing installations...');
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });

    // Install core dependencies
    console.log('📦 Installing core dependencies...');
    execSync(`npm install --save ${dependencies.main.join(' ')}`, { stdio: 'inherit' });

    // Install ML dependencies
    console.log('🧠 Installing ML dependencies...');
    execSync(`npm install --save ${dependencies.ml.join(' ')}`, { stdio: 'inherit' });

    // Install dev dependencies
    console.log('🛠️ Installing development dependencies...');
    const devDeps = [
      ...dependencies.build,
      ...dependencies.typescript,
      ...dependencies.testing,
      ...dependencies.linting,
      ...dependencies.tools
    ];
    execSync(`npm install --save-dev ${devDeps.join(' ')}`, { stdio: 'inherit' });

    // Setup git hooks
    console.log('🪝 Setting up git hooks...');
    execSync('npm run prepare', { stdio: 'inherit' });

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