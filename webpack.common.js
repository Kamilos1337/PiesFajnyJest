const path = require('path');
const webpack = require('webpack');
const lodash = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashPlugin = require('lodash-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
     test: /\.svg$/,
     loader: 'raw-loader'
   }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    contentBase: './',
    hot: true,
    proxy: {
      //'/': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
      //'/src/client/upload': 'http://localhost:3000',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'AppTemplate',
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    new LodashPlugin(),
    new MomentLocalesPlugin()
  ],
  output: {
    filename: '[hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
