const isPrd = process.env.NODE_ENV === 'production' // 保存环境状态
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const isexaminevolume = false
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  publicPath: './', // 部署应用包时的基本 URL
  outputDir: 'dist', // 构建时的输出目录
  assetsDir: 'static', // 静态资源的目录（不会被编译）； assets文件夹会被编译 具体原因：https://blog.csdn.net/qq_41115965/article/details/80796211
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  filenameHashing: true, // 文件名hash
  lintOnSave: false, // 是否在保存的时候使用 `eslint-loader` 进行检查。 有效的值：`ture` | `false` | `"error"`  当设置为 `"error"` 时，检查出的错误会触发编译失败。
  productionSourceMap: false, // 生产环境的 source map
  /* Webpack相关配置: 
	如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
	如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。 */
  configureWebpack: config => {
    if (!isPrd) {
      // 调试js
      config.devtool = 'source-map'
    } else {
      config.optimization = {
        // 分割代码块
        splitChunks: {
          cacheGroups: {
            // 公用模块抽离
            common: {
              chunks: 'initial', // 同步代码  async => 异步，initial => 同步，all => 所有类型
              priority: -20, // 权重
              minSize: 0, // 大于0个字节
              minChunks: 2, // 抽离公共代码时，这个代码块最小被引用的次数
              reuseExistingChunk: true // 为true时，如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件。
            },
            // 第三方库抽离
            vendor: {
              priority: -10, // 权重
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              minSize: 0, // 大于0个字节
              minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
            }
          }
        }
      }
      // 代码混淆 压缩
      config.plugins.push(
        // 兼容ios10以下混淆压缩配置
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            mangle: {
              safari10: true
            }
          }
        })
      )
    }
  },
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias.set('@', resolve('src'))
    // webpack 会默认给commonChunk打进chunk-vendors，所以需要对webpack的配置进行delete
    config.optimization.delete('splitChunks')
    // 包分析
    if (isexaminevolume) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // css 相关配置
  css: {
    // 将组件内的 css 提取到一个单独的 css 文件（只用在生产环境中）
    // extract: true,  Default: 生产环境下是 true，开发环境下是 false
    // 是否开启 css 的 source map
    sourceMap: isPrd ? false : true,
    // 为预处理器的 loader 传递自定义的选项。
    loaderOptions: {
      css: {
        // 传递给 css-loader的自定义选项
      },
      postcss: {
        // 传递给 postcss-loader的自定义选项
      }
    }
  },
  devServer: {
    open: false, // 自动启动浏览器
    host: 'localhost', // 主机
    port: 8181,
    https: false,
    // hot: true, // 热更新：报错->改正-> 刷新
    hotOnly: true, // 热更新：报错->改正-> 不刷新 （推荐）
    proxy: {
      '^/api': {
        target: '', // 接口的域名
        ws: false, //开启WebSocket
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 将主机头的来源更改为目标URL
        pathRewrite: { '^/api': '/api' } // pathRewrite 来重写地址 将前缀 '/api' 转为 '/api'。
      }
      /* '/img': {
				target: '', // 接口的域名
				secure: false, // 如果是https接口，需要配置这个参数
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				pathRewrite: {'^/img': ''} // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
			} */
    }
  }
}
