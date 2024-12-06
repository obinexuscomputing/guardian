import { Canvas } from 'canvas';
import { CaptchaRenderOptions, ImageFormat } from '@core/types/captcha';
export declare class CaptchaRenderer {
    private canvas;
    private ctx;
    constructor(width?: number, height?: number);
    render(options: CaptchaRenderOptions): Promise<Canvas>;
    private renderBackground;
    private renderText;
    private applyNoise;
    private applyDistortion;
    export(format?: ImageFormat): Buffer;
}
