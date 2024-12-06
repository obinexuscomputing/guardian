import { defineConfig } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import baseConfig from './rollup.config.js';

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});