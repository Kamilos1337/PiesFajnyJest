const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  node: {
   process: false,
   global: false,
   fs: "empty"
 },
  externals: [nodeExternals({
   importType: 'umd'
})],
  mode: 'production',
  output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'bundle.js',
     publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
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
    new webpack.DefinePlugin({ // <-- key to reducing React's size
     'process.env': {
       'NODE_ENV': JSON.stringify('production')
     }
   }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Production',
    })
  ]
};
