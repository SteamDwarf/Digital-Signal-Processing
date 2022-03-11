const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"]
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: false,
            hash: true
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        open: true,
        compress: true,
        hot: true
    },
    mode: 'development'
}