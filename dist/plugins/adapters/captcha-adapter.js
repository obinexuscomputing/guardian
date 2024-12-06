import { CaptchaRenderer } from '../../services/captcha/renderer.js';

// src/plugins/adapters/captcha-adapter.ts
class CaptchaPluginAdapter {
    constructor(pluginManager) {
        this.renderer = new CaptchaRenderer();
        this.pluginManager = pluginManager;
    }
    async generate(options) {
        const startTime = Date.now();
        // Execute pre-generation hooks
        const modifiedOptions = await this.pluginManager.executeHook('beforeCaptchaGenerate', options);
        // Generate CAPTCHA
        const canvas = await this.renderer.render(modifiedOptions);
        const imageBuffer = this.renderer.export(options.format || 'png');
        const result = {
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

export { CaptchaPluginAdapter };
//# sourceMappingURL=captcha-adapter.js.map
