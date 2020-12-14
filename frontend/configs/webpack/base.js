const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

const { path } = require('./helpers.js')

module.exports = {
  entry: path('source/app/index.tsx'),
  output: {
    output: path('production/'),
    filename: '[name].bundle.js'
  },
  modules: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          },
          'ts-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          miniCssExtractPlugin.loader,
          'css-loader',
          'sass-laoder'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new miniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new htmlWebpackPlugin({
      template: path('source/index.html')
    })
  ],
  resolve: {
    extensions: [
      '.ts', '.tsx',
      '.css', 'scss',
      '.json'
    ],
    alias: {
      assets: path('assets'),

      ui: path('source/app/ui'),

      components: path('source/app/ui/components'),
      pages: path('source/app/ui/pages'),
      layout: path('source/app/ui/layout'),
      main: path('source/app/ui/main'),

      scripts: path('source/app/scripts'),
      helpers: path('source/app/scripts/helpers')
    }
  }
}
