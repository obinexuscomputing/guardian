import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'canvas',
  'events',
  'path',
  'fs',
  'crypto'
];

// Common plugins used across all builds
const commonPlugins = [
  resolve({
    preferBuiltins: true,
    extensions: ['.ts', '.js', '.json']
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './dist/types',
    rootDir: 'src'
  })
];

export default defineConfig([
  // Core library bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        dir: 'dist'
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
        dir: 'dist'
      }
    ],
    external,
    plugins: [
      ...commonPlugins,
      terser()
    ]
  },

  // Plugin system bundle
  {
    input: 'src/plugins/index.ts',
    output: [
      {
        file: 'dist/plugins/index.js',
        format: 'cjs',
        sourcemap: true,
        dir: 'dist/plugins'
      },
      {
        file: 'dist/plugins/index.mjs',
        format: 'esm',
        sourcemap: true,
        dir: 'dist/plugins'
      }
    ],
    external,
    plugins: commonPlugins
  },

  // Types bundle
  {
    input: './dist/types/index.d.ts',
    output: [{ 
      file: 'dist/index.d.ts', 
      format: 'esm',
      dir: 'dist'
    }],
    plugins: [dts()],
    external
  },

  // Plugin types bundle
  {
    input: './dist/types/plugins/index.d.ts',
    output: [{ 
      file: 'dist/plugins/index.d.ts', 
      format: 'esm',
      dir: 'dist/plugins'
    }],
    plugins: [dts()],
    external
  }
]);