const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const NODE_ENV = process.env.NODE_ENV;
module.exports = {
    entry: {
        popup: './js/popup/index.js',
        cnt:'./js/cnt/index.js',
        bg:'./js/bg/index.js'
    },
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [/*MiniCssExtractPlugin.loader,*/'vue-style-loader', 'css-loader','sass-loader'],
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    performance: {
        hints: false
    },
    mode: NODE_ENV,
    resolve: {
        extensions: ['.js', '.vue']
    },
    devtool: NODE_ENV === 'production' ? false : '#eval-source-map',
/*
    optimization: {
        splitChunks: {
            chunks: 'all',                              //'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
            // maxAsyncRequests: 1,                     // 最大异步请求数， 默认1
            // maxInitialRequests: 1,                   // 最大初始化请求书，默认1
            cacheGroups: {
                // 抽离第三方插件
                vendor: {
                    test: /node_modules/,            //指定是node_modules下的第三方包
                    chunks: 'all',
                    name: 'vendor',                  //打包后的文件名，任意命名
                    priority: 10,                    //设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
                },
                // 抽离自己写的公共代码，utils这个名字可以随意起
                utils: {
                    chunks: 'all',
                    name: 'utils',
                    minSize: 0,                      //只要超出0字节就生成一个新包
                    minChunks: 2,                     //至少两个chucks用到
                    // maxAsyncRequests: 1,             // 最大异步请求数， 默认1
                    maxInitialRequests: 5,           // 最大初始化请求书，默认1
                }
            }
        },
        //提取webpack运行时的代码
        runtimeChunk: {
            name: 'runtime'
        }
    },
*/
    plugins: [
        new VueLoaderPlugin(),
        /*new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),*/
        new HtmlWebpackPlugin({
            filename: 'popup.html',                           //目标文件
            template: './popup.html',                     //模板文件
            chunks: ['popup']  //对应关系，index.js对应的是index.html
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './images'),
                to: path.resolve(__dirname, 'build/images'),
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, './fonts'),
                to: path.resolve(__dirname, 'build/fonts'),
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, './css'),
                to: path.resolve(__dirname, 'build/css'),
                ignore: ['color.scss','popup.scss']
            },
           /* {
                from: path.resolve(__dirname, './popup.html'),
                to: path.resolve(__dirname, 'build/popup.html'),
                ignore: ['.*']
            },*/
            {
                from: path.resolve(__dirname, './manifest.json'),
                to: path.resolve(__dirname, 'build/manifest.json'),
                ignore: ['.*']
            },
        ])
    ]
};

if (NODE_ENV !== 'production') {
    /*module.exports.devServer = {
        hot: true,
        hotOnly: true,
    };
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.HotModuleReplacementPlugin()
    ])*/
}
