// src/plugins/types/plugin.interface.ts

export interface PluginMetadata {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies?: Record<string, string>;
    hooks?: string[];
  }
  
  export interface PluginHooks {
    // Captcha generation hooks
    beforeCaptchaGenerate?: (options: CaptchaOptions) => Promise<CaptchaOptions>;
    afterCaptchaGenerate?: (captcha: CaptchaResult) => Promise<CaptchaResult>;
    
    // Authentication hooks
    beforeValidation?: (token: string) => Promise<string>;
    afterValidation?: (result: ValidationResult) => Promise<ValidationResult>;
    
    // Custom challenge hooks
    generateChallenge?: () => Promise<Challenge>;
    validateChallenge?: (response: any) => Promise<boolean>;
  }
  
  export interface GuardianPlugin {
    metadata: PluginMetadata;
    hooks: PluginHooks;
    initialize?: () => Promise<void>;
    shutdown?: () => Promise<void>;
  }
  
  // Plugin manager types
  export interface PluginManagerOptions {
    pluginsDir: string;
    enableHotReload?: boolean;
    allowedHooks?: string[];
    maxPlugins?: number;
  }
  
  // Types for hook events
  export type HookEvent = keyof PluginHooks;
  export type HookCallback = (...args: any[]) => Promise<any>;