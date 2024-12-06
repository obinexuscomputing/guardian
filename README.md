# GUARDIAN (Generative User Authentication and Recognition Device for Intelligent Access Network)

A modern, extensible CAPTCHA generation system with machine learning resistance and plugin support.

## Features

- Advanced CAPTCHA generation using HTML5 Canvas
- Machine learning resistance through adversarial patterns
- Extensible plugin system for custom implementations
- Multiple image format support (PNG, JPEG)
- Built-in security features and rate limiting
- TypeScript support with full type definitions
- Comprehensive logging and error handling
- Easy integration with popular frameworks

## Installation

```bash
npm install @obinexuscomputing/guardian
```

## Quick Start

```typescript
import { PluginManager } from '@obinexuscomputing/guardian/core';
import { CaptchaPluginAdapter } from '@obinexuscomputing/guardian/plugins';

// Initialize plugin manager
const pluginManager = new PluginManager({
  pluginsDir: './plugins',
  enableHotReload: true,
  maxPlugins: 10
});

// Create CAPTCHA adapter
const captchaAdapter = new CaptchaPluginAdapter(pluginManager);

// Generate CAPTCHA
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
  distortionLevel: 0.2
});
```

## Plugin Development

Create custom plugins to extend GUARDIAN's functionality:

```typescript
import { GuardianPlugin, CaptchaRenderOptions } from '@obinexuscomputing/guardian/types';

export default class CustomCaptchaPlugin implements GuardianPlugin {
  metadata = {
    name: 'custom-captcha-plugin',
    version: '1.0.0',
    description: 'Custom CAPTCHA rendering plugin',
    author: 'Your Name',
    hooks: ['beforeCaptchaGenerate', 'afterCaptchaGenerate']
  };

  hooks = {
    beforeCaptchaGenerate: async (options: CaptchaRenderOptions) => {
      return {
        ...options,
        textOptions: {
          ...options.textOptions,
          font: 'bold 48px Arial',
          color: '#333333'
        }
      };
    }
  };
}
```

## Documentation

- [API Reference](docs/API.md)
- [Plugin Development Guide](docs/PLUGINS.md)
- [Security Best Practices](docs/SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## Project Structure

```
guardian/
├── src/
│   ├── core/             # Core functionality
│   ├── services/         # CAPTCHA services
│   ├── plugins/          # Plugin system
│   └── api/              # API endpoints
├── test/                 # Test files
├── docs/                 # Documentation
└── examples/            # Example implementations
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build project
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.