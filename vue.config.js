module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, './templates/neso-db-assistent/web/v1')
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', require('path').resolve(__dirname, './templates/neso-db-assistent/web/v1'))
  }
}
