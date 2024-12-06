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