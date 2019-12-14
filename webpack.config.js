/* eslint-env node */
/* eslint-disable import/no-commonjs,import/no-nodejs-modules */
const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV =
    process.argv.indexOf("-p") !== -1 ? "production" : "development";
}
const mode = process.env.NODE_ENV;

const baseConfig = {
  mode,
  entry: {
    "background": "./src/background.js",
    "devtools": "./src/devtools.js",
    "content": "./src/content.js",
    "inspector": "./src/inspector.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "/dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "/src"),
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: path.join(__dirname, "/src"),
        options: {
          loaders: {
            scss: ["style-loader", "css-loader", "sass-loader"]
          }
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.png$/,
        loader: "url-loader"
      },
      {
        test: /\.(woff|woff2)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        DEBUG_DEVTOOLS_RX: JSON.stringify(process.env.DEBUG_DEVTOOLS_RX)
      }
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{ context: "src/chrome-extension", from: "**/*" }]),
    new UglifyJsPlugin()
  ],
  performance: {
    hints: false
  }
};
let devConfig = baseConfig;
if (process.env.NODE_ENV === "development") {
  devConfig = merge(baseConfig, {
    devtool: "source-map",
    plugins: [new FriendlyErrorsPlugin()]
  });
}
module.exports = devConfig;
