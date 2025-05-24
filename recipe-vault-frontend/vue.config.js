const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // Disable type check during production build to avoid node_modules type errors
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('fork-ts-checker');
    }
  },
  // Add devServer configuration
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
});
