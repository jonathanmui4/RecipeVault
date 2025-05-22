const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // Disable type check during production build to avoid node_modules type errors
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('fork-ts-checker');
    }
  },
});
