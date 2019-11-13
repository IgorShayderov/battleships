let path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/tests/data.test.js',
    output: {
        path: path.resolve(__dirname, '/dist_tests')
    },
    devServer: {
        port: 8888,
        overlay: true,
        publicPath: "tests/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: ["/node_modules/"],
                loader: ['babel-loader', 'mocha-loader']
            }
            ,
            {
                test: /(\.css|\.less)$/,
                loader: 'null-loader',
                exclude: [
                    /build/
                ]
            },
            {
                test: /(\.jpg|\.jpeg|\.png|\.gif)$/,
                loader: 'null-loader'
            }
        ]
    }
    ,
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/tests/test.html",
            inject: 'body'
        })
    ]
};
