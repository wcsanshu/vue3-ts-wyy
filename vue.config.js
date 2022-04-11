const tsImportPluginFactory = require("ts-import-plugin")
const { merge } = require("webpack-merge")
module.exports = {
  chainWebpack(config) {
    // 配置VantUI按需引入
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap((options) => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: "es2015"
          }
        })
        return options
      })
  },
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    proxy: {
      // 当访问接口地址包含/api的时候 触发此代理
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true, // 是否是跨域
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
}
