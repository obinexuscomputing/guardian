import { EventEmitter } from 'events';
import { GuardianPlugin, PluginMetadata, HookEvent } from '@core/types';
export interface PluginManagerOptions {
    pluginsDir: string;
    enableHotReload?: boolean;
    allowedHooks?: string[];
    maxPlugins?: number;
}
type HookCallback = (...args: any[]) => Promise<any>;
export declare class PluginManager extends EventEmitter {
    private plugins;
    private hooks;
    private options;
    constructor(options: PluginManagerOptions);
    loadPlugin(plugin: GuardianPlugin): Promise<void>;
    private validatePlugin;
    private registerPluginHooks;
    executeHook(event: HookEvent, ...args: any[]): Promise<any>;
    unloadPlugin(pluginName: string): Promise<void>;
    private removePluginHooks;
    getPlugin(name: string): GuardianPlugin | undefined;
    getLoadedPlugins(): PluginMetadata[];
    hasPlugin(name: string): boolean;
    getRegisteredHooks(): string[];
    reloadPlugin(name: string): Promise<void>;
    unloadAllPlugins(): Promise<void>;
    getPluginMetadata(name: string): PluginMetadata | undefined;
    getHookCallbacks(event: HookEvent): HookCallback[];
}
export {};
