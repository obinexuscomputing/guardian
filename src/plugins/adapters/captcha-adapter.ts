// src/plugins/adapters/captcha-adapter.ts

import { CaptchaRenderer } from '@services/captcha/renderer';
import { PluginManager } from '@plugins/core/plugin-manager';
import { CaptchaRenderOptions, CaptchaGenerationResult } from '@core/types';

export class CaptchaPluginAdapter {
  private renderer: CaptchaRenderer;
  private pluginManager: PluginManager;

  constructor(pluginManager: PluginManager) {
    this.renderer = new CaptchaRenderer();
    this.pluginManager = pluginManager;
  }

  public async generate(options: CaptchaRenderOptions): Promise<CaptchaGenerationResult> {
    const startTime = Date.now();

    // Execute pre-generation hooks
    const modifiedOptions = await this.pluginManager.executeHook(
      'beforeCaptchaGenerate',
      options
    );

    // Generate CAPTCHA
    const canvas = await this.renderer.render(modifiedOptions);
    const imageBuffer = this.renderer.export(options.format || 'png');

    const result: CaptchaGenerationResult = {
      image: imageBuffer,
      format: options.format || 'png',
      text: options.text,
      metadata: {
        width: canvas.width,
        height: canvas.height,
        generatedAt: new Date(),
        difficulty: options.difficulty || 'medium',
        renderTime: Date.now() - startTime
      }
    };

    // Execute post-generation hooks
    return this.pluginManager.executeHook('afterCaptchaGenerate', result);
  }
}