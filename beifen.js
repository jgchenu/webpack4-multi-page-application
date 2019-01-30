const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }]
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }, {
                test: /\.(png|gif|jpg)$/,
                use: ["file-loader"]
            }
        ]
    },
    // 代码模块路径解析的配置
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, 'src'),
        ],

        extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".css"],
    },
    //插件
    plugins: [
        //html文件注入js
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
            //这个是相对于dist目录的路径
        }),
        //打包抽离css文件，注入html
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([{
                from: 'src/assets/',
                to: './assets',
            }, // to都是相对于dist目录的路径，/dist/favicon.ico顾名思义，from 配置来源，to 配置目标路径
        ]),
    ],
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
}