// src/plugins/core/plugin-manager.ts

import { EventEmitter } from 'events';
import { 
  GuardianPlugin, 
  PluginManagerOptions, 
  HookEvent, 
  HookCallback 
} from '@/types/'

export class PluginManager extends EventEmitter {
  private plugins: Map<string, GuardianPlugin>;
  private hooks: Map<HookEvent, HookCallback[]>;
  private options: PluginManagerOptions;

  constructor(options: PluginManagerOptions) {
    super();
    this.plugins = new Map();
    this.hooks = new Map();
    this.options = options;
  }

  async loadPlugin(plugin: GuardianPlugin): Promise<void> {
    try {
      // Validate plugin
      this.validatePlugin(plugin);

      // Check if max plugins limit reached
      if (this.options.maxPlugins && this.plugins.size >= this.options.maxPlugins) {
        throw new Error('Maximum number of plugins reached');
      }

      // Initialize plugin
      if (plugin.initialize) {
        await plugin.initialize();
      }

      // Register hooks
      this.registerPluginHooks(plugin);

      // Store plugin
      this.plugins.set(plugin.metadata.name, plugin);
      
      this.emit('pluginLoaded', plugin.metadata);
    } catch (error) {
      this.emit('pluginError', { 
        plugin: plugin.metadata,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private validatePlugin(plugin: GuardianPlugin): void {
    if (!plugin.metadata?.name || !plugin.metadata?.version) {
      throw new Error('Invalid plugin metadata');
    }

    if (this.plugins.has(plugin.metadata.name)) {
      throw new Error(`Plugin ${plugin.metadata.name} already registered`);
    }

    // Validate hooks
    if (this.options.allowedHooks) {
      const invalidHooks = Object.keys(plugin.hooks).filter(
        hook => !this.options.allowedHooks?.includes(hook)
      );
      if (invalidHooks.length > 0) {
        throw new Error(`Invalid hooks found: ${invalidHooks.join(', ')}`);
      }
    }
  }

  private registerPluginHooks(plugin: GuardianPlugin): void {
    Object.entries(plugin.hooks).forEach(([event, callback]) => {
      const hookEvent = event as HookEvent;
      if (!this.hooks.has(hookEvent)) {
        this.hooks.set(hookEvent, []);
      }
      this.hooks.get(hookEvent)?.push(callback as HookCallback);
    });
  }

  async executeHook(event: HookEvent, ...args: any[]): Promise<any> {
    const callbacks = this.hooks.get(event) || [];
    let result = args[0];

    for (const callback of callbacks) {
      try {
        result = await callback(result);
      } catch (error) {
        this.emit('hookError', { event, error });
        throw error;
      }
    }

    return result;
  }

  async unloadPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    // Execute shutdown hook if exists
    if (plugin.shutdown) {
      await plugin.shutdown();
    }

    // Remove all hooks
    this.removePluginHooks(plugin);

    // Remove plugin from registry
    this.plugins.delete(pluginName);
    
    this.emit('pluginUnloaded', plugin.metadata);
  }

  private removePluginHooks(plugin: GuardianPlugin): void {
    Object.keys(plugin.hooks).forEach(event => {
      const hookEvent = event as HookEvent;
      const callbacks = this.hooks.get(hookEvent) || [];
      const filteredCallbacks = callbacks.filter(
        callback => !Object.values(plugin.hooks).includes(callback)
      );
      this.hooks.set(hookEvent, filteredCallbacks);
    });
  }

  getLoadedPlugins(): PluginMetadata[] {
    return Array.from(this.plugins.values()).map(plugin => plugin.metadata);
  }
}