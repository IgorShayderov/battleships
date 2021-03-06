let path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let conf = {
    entry: __dirname + '/src/js/main.js',
    output: {
        path: path.resolve(__dirname, '/build'),
        filename: 'main.js',
        publicPath: '/'
    },
    devServer: {
        overlay: true,
        publicPath: "/",
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        host: '192.168.0.12' // мой IPv4 адресс, чтобы можно было заходить с других устройств в одной сети
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/i,
                use:  ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/public/battleships.html",
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        })
    ]
};

module.exports = (env, options) => {
    conf.devtool = options.mode === "production" ? false : "cheap-module-eval-source-map";

    return conf;
};