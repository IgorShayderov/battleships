let path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        data: __dirname + '/src/js/data.js',
        test: __dirname + '/test/data.test.js'
    },
    output: {
        path: path.resolve(__dirname, '/test-build'),
        filename: '[name].js',
        publicPath: '/'
    },
    devServer: {
        overlay: true,
        publicPath: "/",
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        port: 8888
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.test\.js$/,
                loader: ['babel-loader', 'mocha-loader'],
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/i,
                use:  'null-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/public/tests.html",
            inject: 'body'
        })
    ],
    devtool: "source-map"
};
