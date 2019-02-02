//向html模板注入js
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
//css抽离插件跟注入html的css loader
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//判断mode的状态
const devMode = process.env.NODE_ENV !== 'production'
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
const glob = require('glob')
// 生成多页面html-webpack-plugin 需要的类型参数的方法
function getHtmlConfig(name, chunks) {
    return {
        template: `./src/pages/${name}/index.html`,
        filename: `${name}.html`,
        // favicon: './favicon.ico',
        // title: title,
        inject: true,
        hash: true, //开启hash  ?[hash]
        chunks: chunks,
        minify: devMode === "development" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
        },
    };
}

function getEntry() {
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/pages/**/*.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 3;
            var eArr = [];
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口 
            n = n.split('/')[1];
            eArr.push(name);
            entry[n] = eArr;
        });
    return entry;
}

module.exports = {
    entry: getEntry(),
    module: {
        rules: [{
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../src')
                ],
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(le|c)ss$/,
                //合并抽离css文件，注入html，由于是开发环境，不添加hash后缀,从rules的配置可以知道，
                //没有用到MiniCssExtractPlugin.loader 进行代码压缩
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.html$/,
                // html中的img标签
                use: ["html-withimg-loader"]
            },
            {
                test: /\.(png|gif|jpg)$/,
                use: [{
                        loader: "file-loader",
                        options: {}
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: { // 压缩 jpeg 的配置
                                progressive: true,
                                quality: 65
                            },
                            optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                                enabled: false,
                            },
                            pngquant: { // 使用 imagemin-pngquant 压缩 png
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: { // 压缩 gif 的配置
                                interlaced: false,
                            },
                            webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                                quality: 75
                            },
                        },
                    }
                ]
            },

        ]
    },
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../src')
		}
	},
    //提取公共代码
    optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {   // 抽离第三方插件
					test: /node_modules/,   // 指定是node_modules下的第三方包
					chunks: 'initial',
					name: 'vendor',  // 打包后的文件名，任意命名    
					// 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
					priority: 10    
				},
				utils: { // 抽离自己写的公共代码，common这个名字可以随意起
					chunks: 'initial',
					name: 'common',  // 任意命名
					minSize: 0,    // 只要超出0字节就生成一个新包
					minChunks: 2
				}
			}
		}
    },

    plugins:[// 消除冗余的css代码
		new purifyCssWebpack({
			paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
		}),]
}
//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach(element => {
    htmlArray.push({
        _html: element,
        title: '',
        chunks: ['vendor', element]
    })
})
//自动生成html模板
htmlArray.forEach((element) => {
    module.exports.plugins.push(new HtmlWebPackPlugin(getHtmlConfig(element._html, element.chunks)));
})

