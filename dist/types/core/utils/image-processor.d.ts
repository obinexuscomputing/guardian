export declare class ImageProcessor {
    private canvas;
    private ctx;
    constructor(width?: number, height?: number);
    processImage(buffer: Buffer, options: {
        width?: number;
        height?: number;
        format?: 'png' | 'jpeg';
        quality?: number;
    }): Promise<Buffer>;
    applyNoise(level?: number): Promise<void>;
    applyDistortion(level?: number): Promise<void>;
    toBuffer(format?: 'png' | 'jpeg'): Buffer;
}
