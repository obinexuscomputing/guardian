import { PluginManager } from '@plugins/core/plugin-manager';
import { CaptchaRenderOptions, CaptchaGenerationResult } from '@core/types';
export declare class CaptchaPluginAdapter {
    private renderer;
    private pluginManager;
    constructor(pluginManager: PluginManager);
    generate(options: CaptchaRenderOptions): Promise<CaptchaGenerationResult>;
}
