import { CaptchaRenderOptions, CaptchaGenerationResult } from './captcha';

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: Record<string, string>;
  hooks?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  metadata?: Record<string, any>;
}

export interface Challenge {
  id: string;
  type: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface PluginHooks {
  beforeCaptchaGenerate?: (options: CaptchaRenderOptions) => Promise<CaptchaRenderOptions>;
  afterCaptchaGenerate?: (captcha: CaptchaGenerationResult) => Promise<CaptchaGenerationResult>;
  
  beforeValidation?: (token: string) => Promise<string>;
  afterValidation?: (result: ValidationResult) => Promise<ValidationResult>;
  
  generateChallenge?: () => Promise<Challenge>;
  validateChallenge?: (response: any) => Promise<boolean>;
}

export interface GuardianPlugin {
  metadata: PluginMetadata;
  hooks: PluginHooks;
  initialize?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}