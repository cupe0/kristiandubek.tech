const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const ManifestPlugin = require('webpack-manifest-plugin');

/* eslint-disable-next-line no-unused-vars */
module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const baseOutputPath = path.resolve('../../public/build/website');

    return {
        entry: {
            main: ['./js/main.js', './css/main.scss'],
        },
        output: {
            publicPath: 'build/website/',
            path: baseOutputPath,
            filename: 'js/[name].[hash].js',
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: !isProduction,
                __ENV__: JSON.stringify(argv.mode),
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[hash].css',
            }),
            new ManifestPlugin({
                fileName: baseOutputPath + '/manifest.json',
                map: (data) => Object.assign({}, data, {
                    name: '/' + path.dirname(data.path) + '/' + data.name,
                }),
            }),
            new CleanObsoleteChunks(),
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },
    };
};
