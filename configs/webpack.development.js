const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const path = require('path')
//先生成变量再导出的原因，是可以在这个变量上做其他loader跟plugins插件的拓展
const config = merge.smart(baseConfig, {
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            include: [
                path.resolve(__dirname, '../src')
            ],
            loader: "eslint-loader",
        }]
    },

    //测试mock数据
    devServer: {
        port: '1234',
        before(app) {
            app.get('/api/test.json', function (req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
                res.json({
                    code: 200,
                    message: 'hello world'
                })
            })
        }
    },
    devtool: "source-map",  // 开启调试模式
    plugins: []
})
//config.plugins.push() 用于拓展增加插件
module.exports = config