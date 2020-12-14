const webpack = require('webpack')
const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].bundle.min.js'
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new cleanWebpackPlugin.CleanWebpackPlugin()
  ]
}
