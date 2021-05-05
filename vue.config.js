module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'MiWorkouts';
      return args;
    });
  },
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    workboxOptions: {
      navigateFallback: 'index.html',
			exclude: [/_redirects/],
    }
  },
}
