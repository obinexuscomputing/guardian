import { EventEmitter } from 'events';

class PluginManager extends EventEmitter {
    constructor(options) {
        super();
        this.plugins = new Map();
        this.hooks = new Map();
        this.options = options;
    }
    async loadPlugin(plugin) {
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
        }
        catch (error) {
            this.emit('pluginError', {
                plugin: plugin.metadata,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    validatePlugin(plugin) {
        if (!plugin.metadata?.name || !plugin.metadata?.version) {
            throw new Error('Invalid plugin metadata');
        }
        if (this.plugins.has(plugin.metadata.name)) {
            throw new Error(`Plugin ${plugin.metadata.name} already registered`);
        }
        // Validate hooks
        if (this.options.allowedHooks) {
            const invalidHooks = Object.keys(plugin.hooks).filter(hook => !this.options.allowedHooks?.includes(hook));
            if (invalidHooks.length > 0) {
                throw new Error(`Invalid hooks found: ${invalidHooks.join(', ')}`);
            }
        }
    }
    registerPluginHooks(plugin) {
        Object.entries(plugin.hooks).forEach(([event, callback]) => {
            const hookEvent = event;
            if (!this.hooks.has(hookEvent)) {
                this.hooks.set(hookEvent, []);
            }
            this.hooks.get(hookEvent)?.push(callback);
        });
    }
    async executeHook(event, ...args) {
        const callbacks = this.hooks.get(event) || [];
        let result = args[0];
        for (const callback of callbacks) {
            try {
                result = await callback(result);
            }
            catch (error) {
                this.emit('hookError', { event, error });
                throw error;
            }
        }
        return result;
    }
    async unloadPlugin(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} not found`);
        }
        try {
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
        catch (error) {
            this.emit('pluginError', {
                plugin: plugin.metadata,
                error: error instanceof Error ? error.message : 'Unknown error',
                operation: 'unload'
            });
            throw error;
        }
    }
    removePluginHooks(plugin) {
        Object.keys(plugin.hooks).forEach(event => {
            const hookEvent = event;
            const callbacks = this.hooks.get(hookEvent) || [];
            const filteredCallbacks = callbacks.filter(callback => !Object.values(plugin.hooks).includes(callback));
            this.hooks.set(hookEvent, filteredCallbacks);
        });
    }
    getPlugin(name) {
        return this.plugins.get(name);
    }
    getLoadedPlugins() {
        return Array.from(this.plugins.values()).map(plugin => plugin.metadata);
    }
    hasPlugin(name) {
        return this.plugins.has(name);
    }
    getRegisteredHooks() {
        return Array.from(this.hooks.keys());
    }
    async reloadPlugin(name) {
        if (!this.hasPlugin(name)) {
            throw new Error(`Plugin ${name} not found`);
        }
        const plugin = this.getPlugin(name);
        if (!plugin) {
            throw new Error(`Failed to get plugin ${name}`);
        }
        await this.unloadPlugin(name);
        await this.loadPlugin(plugin);
        this.emit('pluginReloaded', plugin.metadata);
    }
    async unloadAllPlugins() {
        const pluginNames = Array.from(this.plugins.keys());
        for (const name of pluginNames) {
            await this.unloadPlugin(name);
        }
    }
    getPluginMetadata(name) {
        return this.plugins.get(name)?.metadata;
    }
    getHookCallbacks(event) {
        return this.hooks.get(event) || [];
    }
}

export { PluginManager };
//# sourceMappingURL=plugin-manager.js.map
