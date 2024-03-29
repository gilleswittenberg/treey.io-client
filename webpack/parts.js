const webpack = require('webpack')

exports.devServer = function (options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based routing works.
      // This is a good default that will come in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      // If you use Vagrant or Cloud9, set host: options.host || '0.0.0.0';
      // 0.0.0.0 is available to all network devices unlike default `localhost`.
      host: options.host || '0.0.0.0',
      disableHostCheck: true,
      // Defaults to 8080
      port: options.port
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance in larger projects.
      // Good default.
      new webpack.HotModuleReplacementPlugin({
        // Disabled for Webpack 3
        // @LINK: https://github.com/jantimon/html-webpack-plugin/issues/716
        // - multiStep: true
      })
    ]
  }
}

exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.sass$/,
          loaders: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ],
          include: paths
        }
      ]
    }
  }
}
