var webpack = require('webpack');

module.exports = {
    // 页面入口文件配置
    entry: {
        'public': ['./public/src/index.js'],
        'test': ['./public/src/test.js'],
        'list': ['./public/src/list.jsx'],
        'r': ['./public/src/r.jsx']
    },
    // 入口文件输出配置
    output: {
        path: __dirname + '/public/js/',
        filename: '[name].js'
    },
    module: {
        // 加载器配置
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader!jsx-loader?harmony'
        }, {
            test: /\.js|jsx$/,
            loaders: ['babel?presets[]=es2015,presets[]=react,presets[]=stage-3']
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }]
    },
    // 其他解决方案配置
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
    },
    // 插件项
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
}