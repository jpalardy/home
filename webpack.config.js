const path              = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

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
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    "last 2 Chrome versions",
                  ],
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.png$/,
        loader:  'url-loader',
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
      inlineSource: /\.css$/,
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
};
