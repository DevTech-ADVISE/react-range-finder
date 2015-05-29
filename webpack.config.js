/* jshint node: true */
var path = require('path');


module.exports = {
  context: path.join(__dirname),
  entry: './example.js',

  output: {
    path: path.join(__dirname),
    filename: 'react-range-finder.js',
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
        test: /(\.js)|(\.jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
    ]
  }
};
