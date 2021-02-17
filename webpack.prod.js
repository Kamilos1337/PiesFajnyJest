const merge = require('webpack-merge');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const LodashPlugin = require('lodash-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: '',
  plugins: [
    new LodashPlugin(),
    new MomentLocalesPlugin(),
    new CompressionPlugin({
      test: /\.(js|css|html|svg|ico)$/,
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      threshold: 10240,
      // threshold: 500,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    new BrotliPlugin({
      test: /\.(js|css|html|svg|ico)$/,
      asset: '[path].br[query]',
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ],
  optimization: {
    minimize: true
  }
});
