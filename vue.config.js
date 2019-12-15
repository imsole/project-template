let apiUrl = process.env.VUE_APP_API_URL;

module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  runtimeCompiler: false, // 禁止使用template模板，影响js代码性能
  // 这几个在ie报错，所以单独转换一下，文件在mode_modules里面
  // https://cli.vuejs.org/zh/config/#transpiledependencies
  transpileDependencies: [],
  // 关闭hash
  filenameHashing: true,
  // source map
  productionSourceMap: true,
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api/c/v2': {
        target: apiUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/api/c/v2': '/api/c/v2'
        }
      }
    }
  },
};
