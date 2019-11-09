let path = require('path');
let glob = require("glob");

let entry = __dirname + './src/js/main.js';
let outputPath = path.resolve(__dirname, './build');
if (process.env.TESTBUILD) {
 entry = glob.sync(__dirname + "./test/*.js");
 outputPath = __dirname + "/test-dist/";
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let conf = {
    entry: entry,
    output: {
        path: outputPath,
        filename: 'main.js',
        publicPath: './'
    },
    devServer: {
        overlay: true,
        publicPath: "/",
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        host: '0.0.0.0'
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