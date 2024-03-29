const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

const parts = require('./webpack/parts')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}
const TARGET = process.env.npm_lifecycle_event
process.env.BABEL_ENV = TARGET

const babel = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default.
        // If you need something more custom, pass a path to it.
        // I.e., babel?cacheDirectory=<path>
        loaders: ['babel-loader?cacheDirectory'],
        // Parse only app files! Without this it will go through the entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          limit: 25000
        }
      }
    ]
  }
}

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's convenient with more complex configurations.
  entry: ['babel-polyfill', PATHS.app],
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      favicon: 'app/favicon.ico'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  // Important! Do not remove ''. If you do, imports without an extension won't work anymore!
  resolve: {
    extensions: ['.js', '.jsx']
  }
}

let config

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
case 'build':
  config = merge(
    common,
    babel,
    {
      devtool: 'source-map'
    },
    parts.setupCSS(PATHS.app)
  )
  break
default:
  config = merge(
    common,
    babel,
    {
      devtool: 'eval-source-map'
    },
    parts.setupCSS(PATHS.app),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT
    })
  )
}

module.exports = config
