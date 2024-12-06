const pluginManager = new PluginManager({
    pluginsDir: './plugins',
    enableHotReload: true,
    maxPlugins: 10
  });
  
  // Load a plugin
  const customPlugin = new CustomCaptchaPlugin();
  await pluginManager.loadPlugin(customPlugin);
  
  // Execute hooks
  const captchaOptions = await pluginManager.executeHook('beforeCaptchaGenerate', defaultOptions);