var path              = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  entry: {
    bundle: "./src/js/app.js",
  },
  output: {
    path:     path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test:    /\.js$/,
        exclude: /node_modules/,
        loader:  'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'less-loader'],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("out.css"),
    new HtmlWebpackPlugin({
      template:     "./src/html/index.html",
      inlineSource: /\.(js|css)$/,
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
};
