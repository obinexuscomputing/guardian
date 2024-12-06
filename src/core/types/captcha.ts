// src/core/types/captcha.ts

export type ImageFormat = 'png' | 'jpeg' | 'jpg';

export interface TextOptions {
  font?: string;
  size?: number;
  color?: string;
  angle?: number;
  spacing?: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface BackgroundOptions {
  color?: string;
  pattern?: 'grid' | 'dots' | 'lines' | 'none';
  patternColor?: string;
  patternDensity?: number;
}

export interface CaptchaRenderOptions {
  text: string;
  width?: number;
  height?: number;
  background?: BackgroundOptions;
  textOptions?: TextOptions;
  noiseLevel?: number;
  distortionLevel?: number;
}

export interface CaptchaGenerationResult {
  image: Buffer;
  format: ImageFormat;
  text: string;
  metadata: {
    width: number;
    height: number;
    generatedAt: Date;
    difficulty: string;
    renderTime: number;
  };
}