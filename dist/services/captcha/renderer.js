import { createCanvas } from 'canvas';

class CaptchaRenderer {
    constructor(width = 300, height = 100) {
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
    }
    async render(options) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Apply background with null check
        if (options.background) {
            await this.renderBackground(options.background);
        }
        // Render text with null check
        if (options.textOptions) {
            await this.renderText(options.text, options.textOptions);
        }
        // Apply noise and distortion
        if (options.noiseLevel) {
            await this.applyNoise(options.noiseLevel);
        }
        if (options.distortionLevel) {
            await this.applyDistortion(options.distortionLevel);
        }
        return this.canvas;
    }
    async renderBackground(options) {
        // Background rendering implementation
    }
    async renderText(text, options) {
        // Text rendering implementation
    }
    async applyNoise(level) {
        // Noise implementation
    }
    async applyDistortion(level) {
        // Distortion implementation
    }
    export(format = 'png') {
        switch (format.toLowerCase()) {
            case 'png':
                return this.canvas.toBuffer('image/png');
            case 'jpeg':
            case 'jpg':
                return this.canvas.toBuffer('image/jpeg');
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
}

export { CaptchaRenderer };
//# sourceMappingURL=renderer.js.map
