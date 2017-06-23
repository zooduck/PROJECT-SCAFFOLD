const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const getNodeEnv = () => process.env.NODE_ENV.trim()

const extractStylesheets = new ExtractTextPlugin({
    filename: "[name].bundle.css",
    disable: getNodeEnv() === "development"
});
// const extractCss = new ExtractTextPlugin({
//     filename: "[name].css-bundle.css",
//     disable: getNodeEnv() === "development"
// });

const config = {
    context: path.resolve(__dirname, "src"),
    entry: {     
        app: "./scripts/index.js"        
    },
    // entry: {
    //     "project-name": [          
    //         "./scripts/index.js"
    //     ]
    // },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(html|ejs)$/,
                include: path.resolve(__dirname, "src"),
                loader: "html-loader"
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
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    plugins: [
        extractStylesheets,
        new webpack.optimize.CommonsChunkPlugin({
            name: "dependencies",
            minChunks: function(module){
              return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
          title: "title defined in webpack.dev.config.js",
          template: "./templates/index.ejs"
        })       
    ]
};

// extract .scss files
const scssRuleProd = {
    test: /\.scss$/,
    use: extractStylesheets.extract({
        fallback: "style-loader",                  
        use: [
            {
                loader: "css-loader",
                options: { importLoaders: 1}
            },
            "postcss-loader", // NOTE: for this to work all @import statements must be explicit, i.e. @import "_theme.scss" instead of @import "theme"
            "sass-loader"           
        ]
    })
};

const scssRuleDev = {
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
};

// extract .css files
const cssRuleProd = {
    test: /\.css$/,
    use: extractStylesheets.extract({
        fallback: "style-loader",
        use: ["css-loader", "postcss-loader"]
    })
};

const cssRuleDev = {
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
};

if (getNodeEnv() === "production") {    
    config.module.rules.push(scssRuleProd);
    config.module.rules.push(cssRuleProd);
    // config.plugins.push(new webpack.optimize.UglifyJsPlugin()); // minify
} else {
    config.module.rules.push(scssRuleDev);
    config.module.rules.push(cssRuleDev);
}

module.exports = config;
