/* jshint node: true */
var path = require('path');


module.exports = {
  context: path.join(__dirname),
  devtool: 'source-map',
  entry: './example.js',

  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'ReactRangeFinder'
  },

  module: {
    loaders: [
      {
        test: /\.s?css$/,
        // Query parameters are passed to node-sass
        loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' + (path.resolve(__dirname, './node_modules'))
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets:['react'] }
      }
    ]
  }
};
