// src/plugins/examples/custom-captcha/index.ts

import { GuardianPlugin, CaptchaOptions, CaptchaResult } from '../../types/plugin.interface';

export default class CustomCaptchaPlugin implements GuardianPlugin {
  metadata = {
    name: 'custom-captcha-plugin',
    version: '1.0.0',
    description: 'Custom CAPTCHA generation plugin',
    author: 'Your Name',
    hooks: ['beforeCaptchaGenerate', 'afterCaptchaGenerate']
  };

  hooks = {
    beforeCaptchaGenerate: async (options: CaptchaOptions): Promise<CaptchaOptions> => {
      // Modify CAPTCHA options before generation
      return {
        ...options,
        difficulty: 'hard',
        customPattern: true
      };
    },

    afterCaptchaGenerate: async (captcha: CaptchaResult): Promise<CaptchaResult> => {
      // Add additional processing after CAPTCHA generation
      return {
        ...captcha,
        metadata: {
          ...captcha.metadata,
          enhanced: true
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

// fixtures/custom-captcha-plugin/index.ts

import { GuardianPlugin, CaptchaRenderOptions, CaptchaGenerationResult } from '../../src/core/types';

export default class CustomCaptchaPlugin implements GuardianPlugin {
  metadata = {
    name: 'custom-captcha-plugin',
    version: '1.0.0',
    description: 'Custom CAPTCHA rendering plugin with HTML5 Canvas support',
    author: 'Your Name',
    hooks: ['beforeCaptchaGenerate', 'afterCaptchaGenerate']
  };

  hooks = {
    beforeCaptchaGenerate: async (options: CaptchaRenderOptions): Promise<CaptchaRenderOptions> => {
      return {
        ...options,
        textOptions: {
          ...options.textOptions,
          font: 'bold 48px Arial',
          color: '#333333',
          angle: Math.random() * 20 - 10 // Random rotation between -10 and 10 degrees
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
}