const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

const { path } = require('./helpers.js')

module.exports = {
  entry: path('source/app/index.tsx'),
  output: {
    path: path('production/')
  },
  module: {
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
          {
            loader: 'ts-loader',
            options: {
              configFile: path('tsconfig.json')
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          miniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
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
      template: path('source/index.html'),
      favicon: path('assets/favicon.ico')
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.ts', '.tsx',
      '.css', '.scss'
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
