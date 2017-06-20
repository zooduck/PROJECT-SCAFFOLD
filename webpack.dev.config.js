const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: {
        "banana": [
            // "webpack-dev-server/client?http://localhost:8080/",
            // "webpack/hot/dev-server",
            "./src/app.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src"),
                loader: "html-loader"
            },           
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1}
                        },
                        "postcss-loader"
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",                  
                    use: [
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1}
                        },
                        "sass-loader",
                        // "postcss-loader" // NOTE: this works but ONLY if there are no @imports
                    ]
                })
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src"),
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["es2015", {modules: false}]
                        ]
                    }
                }]               
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: "source-map",
    plugins: [
        // new webpack.loaderOptionsPlugin({
        //     options: {
        //         postcss: [
        //             autoprefixer("last 2 versions")
        //         ]
        //     }
        // }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
          title: "title defined in webpack.dev.config.js",
          template: "./src/index.ejs"
        }),
        new ExtractTextPlugin({
            filename: "[name].bundle.css",
            allChunks: true
        })
    ]
};

module.exports = config;
