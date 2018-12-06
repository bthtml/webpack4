const path = require('path');
const webpack = require('webpack');
//生成html静态文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清除dlist
const CleanWebpackPlugin = require('clean-webpack-plugin');
//复制指定文件
const copyWebpackPlugin = require('copy-webpack-plugin');
//打包分离css
const miniCssExtractPlugin = require("mini-css-extract-plugin");
//压缩css
const optimizeCss = require('optimize-css-assets-webpack-plugin');
//压缩js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//全局域名
const website={
    publicPath:'http://localhost:8080/'
};
//配置页面
const htmlArray = [
    {
        _html: 'index',
        title: '首页',
        chunks: ['jquery','index']
    },
    {
        _html: 'user',
        title: '登录',
        chunks: ['jquery','user']
    },
    {
        _html: 'type',
        title: '类型',
        chunks: ['jquery','type']
    },
];
module.exports = {
    entry:{
        index:'./src/index/index.js',
        user:'./src/user/user.js',
        type:'./src/type/type.js',
    },
    // webpack会根据mode进行对Js打包，development压缩，production下面自动压缩
    mode:'development',// production
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new miniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new optimizeCss({
            cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                // cssnano 集成了autoprefixer的功能
                // 会使用到autoprefixer进行无关前缀的清理
                // 关闭autoprefixer功能
                // 使用postcss的autoprefixer功能
                autoprefixer: false
            },
            canPrint: true
        }),
        new UglifyJsPlugin(),
/*        new copyWebpackPlugin([{
            from: __dirname+'/src/public',
            to: './public',
            ignore: ['.*']
        }]),*/
       /* new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index/user.ejs',
            template: 'src/index/user.ejs',
            chunks: ['index']
         }),
        new HtmlWebpackPlugin({
            title: 'user',
            filename: 'user/user.ejs',
            template: 'src/user/user.ejs',
            chunks: ['user']
        }),*/

    ],
    output: {
        filename: 'js/[name]_[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath:website.publicPath
    },
    //本地服务
    devServer: {
        contentBase: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            removeComments: false,
                            collapseWhitespace: false,
                            attrs:['img:src']
                        }
                    }
                ],
            },
            {
              test:/\.(png|svg|jpg|gif)$/,
                use:[
                    {
                        loader:'url-loader',
                        options: {
                            name: "img/[name]-[hash:8].[ext]",
                            limit: 20000, // size <= 20KB
                            publicPath: website.publicPath,
                        }
                    },
                    {
                        loader: "img-loader",
                        options: {
                            plugins: [
                                require("imagemin-pngquant")({
                                    quality: "80" // the quality of zip
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: miniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../'
                        }
                    },
                    'css-loader','postcss-loader'
                ]
            },
            {
                test:/\.(sass|scss)$/,
                use: [{
                    loader: "style-loader"
                },
                {
                        loader: miniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../'
                        }
                },
                    {loader: 'css-loader',options: { importLoaders: 1 }},
                    {
                        loader: 'postcss-loader',
                        options: { config: { path: path.resolve(__dirname, './postcss.config.js') } }
                    }, {
                    loader: "sass-loader"
                }]
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader: "babel-loader"
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name:'jquery',
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
var getHtmlConfig = function (name, chunks,title) {
    return {
        template: `./src/${name}/${name}.html`,
        filename: `${name}.html`,
        // favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true, //开启hash  ?[hash]
        chunks: chunks,//页面要引入的包
        minify: process.env.NODE_ENV === "development" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            //removeAttributeQuotes: true, //去除属性引用
        },
    };
};
//自动生成html模板
htmlArray.forEach((element) => {
    module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks,element.title)));
})