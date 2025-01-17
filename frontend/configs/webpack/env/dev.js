module.exports = {
  mode: 'development',
  output: {
    filename: '[name].bundle-[contenthash].js'
  },
  cache: true,
  devtool: 'source-map',
  devServer: {
    port: 8080,
    hot: true,
    inline: true,
    publicPath: '/',
    historyApiFallback: true
  }
}
