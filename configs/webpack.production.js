const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = merge.smart(baseConfig, {
    module: {
        rules: [{
            test: /\.(c|le)ss$/,
            use: [MiniCssExtractPlugin.loader, {
                loader: 'css-loader',
            }, 'postcss-loader', 'less-loader']
        }]
    },
    plugins: [
        //每次打包完清理dist文件夹
        new CleanWebpackPlugin(['../dist']),
        //打包抽离hash css文件，注入html
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        }),
        //静态资源的直接复制
        new CopyWebpackPlugin([{
                from: './src/assets/',
                to: './assets',
            }, // to都是相对于dist目录的路径，/dist/favicon.ico顾名思义，from 配置来源，to 配置目标路径
        ]),
    ]
})
//config.plugins.push() 用于拓展增加插件
module.exports = config;