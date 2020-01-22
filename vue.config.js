module.exports = {
  devServer: {
    port: 9080,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
