const path = require('path')

const resolve = dir => {
	return path.join(__dirname,dir)
}
module.exports = {
	publicPath: './',
	productionSourceMap: false,
	chainWebpack: config => {
		config.resolve.alias
			.set('@',resolve('./src'))
			.set('_c',resolve('./src/components'))
			.set('_img',resolve('./src/assets/img'))
	},
	devServer: {
		proxy: {
			'api': {
				target: '',
				ws: false,// 是否代理websocket
				changeOrigin: true,
				pathRewrite: {
					'api':'api'
				}
			}
		}
	}
}
