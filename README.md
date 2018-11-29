# webpack4.26.1

名称：webpack4搭建多页面demo
webpack版本号：4.26.1


##填坑之旅

###1.webpack4 Cannot find module '@babel/core'

原因"babel-loader": "^8.0.0" 版本问题。 
使用"babel-loader": "^7.1.5"即可解决该错误。


###2.extract-text-webpack-plugin插件提取单独打包css文件时，报错

原因webpack4改用mini-css-extract-plugin打包
`
const miniCssExtractPlugin = require("mini-css-extract-plugin");
    module: {
        rules: [
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
        ]
        }
`


###3.html-webpack-plugin 中使用 title等选项设置模版中的值无效

原因html-loader与html-webpack-plugin冲突,html-loader直接把 <%= htmlWebpackPlugin.options.title %>解析成字符串
利用ejs模板的语法来动态插入各自页面的thunk和css样式
