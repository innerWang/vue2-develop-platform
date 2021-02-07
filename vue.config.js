const theme = {
  'primary-color': '#0F70B2',
  'text-color': 'rgba(0,0,0,0.85)',
};

module.exports = {
  runtimeCompiler: true,
  devServer: {
    port: 3000,
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: Object.keys(theme)
          .map((k) => `$${k}: ${theme[k]};`)
          .join(''),
      },
      less: {
        lessOptions: {
          modifyVars: Object.keys(theme).reduce((acc, k) => {
            acc[k] = theme[k];
            return acc;
          }, {}),
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '开发平台';
      return args;
    });
  },
};
