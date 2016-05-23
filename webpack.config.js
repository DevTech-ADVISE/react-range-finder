var webpack = require('webpack');
var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {presets:['react']},
      },
      {
        test: /\.s?css$/,
        // Query parameters are passed to node-sass
        loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' + (path.resolve(__dirname, './node_modules'))
      },
    ],
  },

  entry: './src/react-range-finder.js',

  output: {
    library: 'ReactRangeFinder',
    libraryTarget: 'umd',
    path: 'dist',
    filename: 'react-range-finder.js',
  },

  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
  },

  node: {
    Buffer: false
  },

};
