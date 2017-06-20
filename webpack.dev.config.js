const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "[name].bundle.css",
    disable: process.env.NODE_ENV === "development"
});

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
            // {
            //     test: /\.css$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: "style-loader",
            //         use: [
            //             {
            //                 loader: "css-loader",
            //                 options: { importLoaders: 1}
            //             },
            //             "postcss-loader"
            //         ]
            //     })
            // },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",                  
                    use: [
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1}
                        },
                        "sass-loader",
                        "postcss-loader" // NOTE: for this to work all @import statements must be explicit, i.e. @import "_theme.scss" instead of @import "theme"
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
        extractSass,
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
          title: "title defined in webpack.dev.config.js",
          template: "./src/index.ejs"
        }),
        new ExtractTextPlugin({
            filename: "[name].bundle.css",
            disable: process.env.NODE_ENV === "development",
            allChunks: true
        })
    ]
};

module.exports = config;
