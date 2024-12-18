export type ImageFormat = 'png' | 'jpeg' | 'jpg';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

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
  format?: ImageFormat;
  difficulty?: DifficultyLevel;
}

export interface CaptchaGenerationResult {
  image: Buffer;
  format: ImageFormat;
  text: string;
  metadata: {
    width: number;
    height: number;
    generatedAt: Date;
    difficulty: DifficultyLevel;
    renderTime: number;
  };
}