import sharp from 'sharp';
import { createCanvas, loadImage, Canvas } from 'canvas';
import { GuardianError } from './error-handler';
import { logger } from '../config/logger';

export class ImageProcessor {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

  constructor(width: number = 300, height: number = 100) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  public async processImage(
    buffer: Buffer,
    options: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg';
      quality?: number;
    }
  ): Promise<Buffer> {
    try {
      const processor = sharp(buffer);

      if (options.width || options.height) {
        processor.resize(options.width, options.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });
      }

      return processor
        .toFormat(options.format || 'png', {
          quality: options.quality || 90,
          effort: 10
        })
        .toBuffer();
    } catch (error) {
      logger.error('Image processing failed:', error);
      throw new GuardianError(
        'Failed to process image',
        'IMAGE_PROCESSING_ERROR',
        500
      );
    }
  }

  public async applyNoise(level: number = 0.5): Promise<void> {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < level) {
        const noise = Math.random() * 255;
        data[i] = noise;     // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  public async applyDistortion(level: number = 0.5): Promise<void> {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const source = new Uint8ClampedArray(imageData.data);
    
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const displacement = Math.sin(y * 0.1) * level * 10;
        const sourceX = Math.floor(x + displacement);
        
        if (sourceX >= 0 && sourceX < this.canvas.width) {
          const targetIndex = (y * this.canvas.width + x) * 4;
          const sourceIndex = (y * this.canvas.width + sourceX) * 4;
          
          imageData.data[targetIndex] = source[sourceIndex];
          imageData.data[targetIndex + 1] = source[sourceIndex + 1];
          imageData.data[targetIndex + 2] = source[sourceIndex + 2];
          imageData.data[targetIndex + 3] = source[sourceIndex + 3];
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  public toBuffer(format: 'png' | 'jpeg' = 'png'): Buffer {
    return format === 'png' 
      ? this.canvas.toBuffer('image/png')
      : this.canvas.toBuffer('image/jpeg', { quality: 0.9 });
  }
}