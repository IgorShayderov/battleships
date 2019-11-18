let path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: __dirname + '/test/data.test.js',
    output: {
        path: path.resolve(__dirname, '/test-build'),
        filename: '[name].js',
        publicPath: '/',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
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
                loader: ['source-map-loader', 'babel-loader'],
                exclude: '/node_modules/'
            },
            {
                test: /\.test\.js$/,
                loader:  'mocha-loader',
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
    devtool: 'cheap-module-eval-source-map'
};
