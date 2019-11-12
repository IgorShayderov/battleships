let path = require('path');

module.exports = {
    entry: './test/test.js',
    output: {
        path: path.resolve(__dirname, '/build'),
        filename: 'test.js',
        publicPath: './'
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
                test: /\.scss$/i,
                use:  ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    }
};