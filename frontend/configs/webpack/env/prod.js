const webpack = require('webpack')
const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new cleanWebpackPlugin.CleanWebpackPlugin()
  ]
}
