declare module 'canvas' {
    export class Canvas {
      getContext(contextId: '2d'): CanvasRenderingContext2D;
      toBuffer(mimeType: string, config?: any): Buffer;
      width: number;
      height: number;
    }
    
    export class CanvasRenderingContext2D {
      canvas: Canvas;
      fillStyle: string;
      font: string;
      textAlign: string;
      textBaseline: string;
      
      clearRect(x: number, y: number, width: number, height: number): void;
      fillText(text: string, x: number, y: number, maxWidth?: number): void;
      getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
      putImageData(imageData: ImageData, dx: number, dy: number): void;
    }
    
    export function createCanvas(width: number, height: number): Canvas;
    export function loadImage(source: string | Buffer): Promise<any>;
  }
  
  declare module 'sharp' {
    interface Sharp {
      resize(width?: number, height?: number, options?: any): Sharp;
      toFormat(format: string, options?: any): Sharp;
      toBuffer(): Promise<Buffer>;
    }
    
    interface SharpConstructor {
      (input?: Buffer | string): Sharp;
    }
    
    const sharp: SharpConstructor;
    export default sharp;
  }