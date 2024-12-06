# @obinexuscomputing/guardian Plugin System

GUARDIAN (Generative User Authentication and Recognition Device for Intelligent Access Network) provides a flexible plugin system for customizing CAPTCHA generation and validation.

## Plugin System Overview

The plugin system allows you to:
- Modify CAPTCHA generation options
- Add custom rendering effects
- Extend validation logic
- Add new CAPTCHA types
- Customize appearance and difficulty

## Quick Start

```typescript
import { PluginManager } from '@obinexuscomputing/guardian/core';
import { CaptchaPluginAdapter } from '@obinexuscomputing/guardian/plugins';
import { CustomCaptchaPlugin } from './custom-captcha-plugin';

// Initialize plugin manager
const pluginManager = new PluginManager({
  pluginsDir: './plugins',
  enableHotReload: true,
  maxPlugins: 10
});

// Create and register your plugin
const customPlugin = new CustomCaptchaPlugin();
await pluginManager.loadPlugin(customPlugin);

// Create CAPTCHA adapter
const captchaAdapter = new CaptchaPluginAdapter(pluginManager);

// Generate CAPTCHA with plugin modifications
const captcha = await captchaAdapter.generate({
  text: 'ABC123',
  width: 300,
  height: 100,
  textOptions: {
    font: 'Arial',
    size: 48,
    color: '#000000'
  },
  background: {
    pattern: 'grid',
    patternColor: '#f0f0f0',
    patternDensity: 0.8
  },
  noiseLevel: 0.3,
  distortionLevel: 0.2,
  format: 'png'
});
```

## Creating a Custom Plugin

Here's an example of a basic CAPTCHA plugin with HTML5 Canvas support:

```typescript
import { 
  GuardianPlugin, 
  CaptchaRenderOptions, 
  CaptchaGenerationResult 
} from '@obinexuscomputing/guardian/types';

export default class CustomCaptchaPlugin implements GuardianPlugin {
  metadata = {
    name: 'custom-captcha-plugin',
    version: '1.0.0',
    description: 'Custom CAPTCHA rendering plugin with HTML5 Canvas support',
    author: 'Your Name',
    hooks: ['beforeCaptchaGenerate', 'afterCaptchaGenerate']
  };

  hooks = {
    // Modify options before CAPTCHA generation
    beforeCaptchaGenerate: async (options: CaptchaRenderOptions): Promise<CaptchaRenderOptions> => {
      return {
        ...options,
        textOptions: {
          ...options.textOptions,
          font: 'bold 48px Arial',
          color: '#333333',
          angle: Math.random() * 20 - 10
        },
        background: {
          pattern: 'grid',
          patternColor: '#f0f0f0',
          patternDensity: 0.8
        },
        noiseLevel: 0.3,
        distortionLevel: 0.2
      };
    },

    // Process the generated CAPTCHA
    afterCaptchaGenerate: async (result: CaptchaGenerationResult): Promise<CaptchaGenerationResult> => {
      return {
        ...result,
        metadata: {
          ...result.metadata,
          enhanced: true,
          plugin: 'custom-captcha'
        }
      };
    }
  };

  async initialize(): Promise<void> {
    console.log('Custom CAPTCHA plugin initialized');
  }

  async shutdown(): Promise<void> {
    console.log('Custom CAPTCHA plugin shutdown');
  }
}
```

## Plugin Hooks

Available hooks for CAPTCHA plugins:

- `beforeCaptchaGenerate`: Modify generation options before creating the CAPTCHA
- `afterCaptchaGenerate`: Process or enhance the generated CAPTCHA
- `validateCaptcha`: Custom validation logic
- `generateChallenge`: Create custom CAPTCHA challenges

## Configuration Options

Plugin configuration options:

```typescript
interface PluginManagerOptions {
  pluginsDir: string;         // Directory containing plugins
  enableHotReload?: boolean;  // Enable hot reloading of plugins
  allowedHooks?: string[];    // Restrict available hooks
  maxPlugins?: number;        // Maximum number of loaded plugins
}

interface CaptchaRenderOptions {
  text: string;               // CAPTCHA text to render
  width?: number;             // Canvas width
  height?: number;            // Canvas height
  background?: {              // Background options
    pattern?: 'grid' | 'dots' | 'lines' | 'none';
    patternColor?: string;
    patternDensity?: number;
  };
  textOptions?: {            // Text rendering options
    font?: string;
    size?: number;
    color?: string;
    angle?: number;
  };
  noiseLevel?: number;       // Amount of noise to add
  distortionLevel?: number;  // Level of image distortion
  format?: 'png' | 'jpeg';   // Output format
}
```

## Tips for Plugin Development

1. Use TypeScript for better type safety and development experience
2. Implement proper initialization and cleanup in `initialize()` and `shutdown()`
3. Handle errors gracefully in hook implementations
4. Use metadata to document plugin requirements and capabilities
5. Follow the single responsibility principle - create focused plugins
6. Test plugins with different CAPTCHA configurations

## Error Handling

Plugins should handle errors appropriately:

```typescript
hooks = {
  beforeCaptchaGenerate: async (options: CaptchaRenderOptions): Promise<CaptchaRenderOptions> => {
    try {
      // Your plugin logic here
      return modifiedOptions;
    } catch (error) {
      console.error('Plugin error:', error);
      // Fall back to original options on error
      return options;
    }
  }
};
```

## Installation

```bash
npm install @obinexuscomputing/guardian
```

For development:
```bash
npm install --save-dev typescript @types/node
```

## Contributing

Please see our [contributing guide](CONTRIBUTING.md) for guidelines on how to create and submit plugins for GUARDIAN.