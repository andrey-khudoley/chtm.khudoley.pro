module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, './_stage/neso-assistant/web/v1')
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', require('path').resolve(__dirname, './_stage/neso-assistant/web/v1'))
  }
}
