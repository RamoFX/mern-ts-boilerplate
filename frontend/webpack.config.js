// Packages
const pkg = require('gulp-load-plugins')({overridePattern: true, pattern: ['*']})



// Files
const projectConfig = require('../project.config.json')



// Helpers
const mode = process.env.NODE_ENV
const dev = mode == 'development'
const prod = mode == 'production'

const path = (...items) => [__dirname, ...(items || [])].flat().join('/')

const filename = ext => `[name]${ dev && '-[contenthash]' }.bundle.min.${ ext }`

// ReturnIF: Return object or array if condition else return empty object or array of the same type
const rif = (cond, obj) => {
  const obj_empty = Array.isArray(obj) ? [] : {}
  return cond ? obj : obj_empty
}

const module_obj = (test, use, exclude = /node_modules/) => ({
  test,
  use,
  exclude
})

const frontendConfig = projectConfig.frontend

const script = frontendConfig.languages.script
const style = frontendConfig.languages.style
const framework = frontendConfig.stack.framework

const script_ext = `${ script }${ framework == 'react' && 'x' }`

const entryFile_name = `index.${ script_ext }`

const scriptModule = () => {
  const test = new RegExp(`\.${ script }${ framework == 'react' && 'x?' }$`)

  return module_obj(test, [
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
    script == 'ts' ? 'ts-loader' : []
  ].flat())
}

const styleModule = () => {
  const css_regexp = /\.css$/
  const sass_regexp = /\.s[ac]ss$/

  const is_sass = sass_regexp.test(`.${ style }`)

  const test = is_sass ? sass_regexp : css_regexp

  return module_obj(test, [
    {
      loader: pkg.miniCssExtractPlugin.loader,
      options: {}
    },
    'css-loader',
    is_sass ? 'sass-loader' : []
  ].flat())
}



// Main config
module.exports = {
  mode,

  entry: path('source', 'app', entryFile_name),
  output: {
    path: path('production'),
    filename: filename('js')
  },

  module: {
    rules: [
      // Main modules
      scriptModule(),
      styleModule(),

      // Other modules
      module_obj(/\.(png|jpe?g|gif)$/i, [
        {
          loader: 'file-loader'
        }
      ])
    ]
  },

  resolve: {
    extensions: [
      // Script
      '.js',
      ...rif(framework == 'react', ['.jsx']),
      ...rif(script == 'ts', [
        '.ts',
        ...rif(framework == 'react', ['.tsx'])
      ]),

      // Style
      '.css',
      ...rif(style != 'css', [style]),

      // Other
      '.json'
    ].flat(),
    alias: {
      assets: path('assets'),

      ui: path('source/app', 'ui'),

      components: path('source/app/ui', 'components'),
      pages: path('source/app/ui', 'pages'),
      layout: path('source/app/ui', 'layout'),
      main: path('source/app/ui', 'main'),

      scripts: path('source/app/scripts'),
      helpers: path('source/app/scripts', 'helpers')
    }
  },

  plugins: [
    new pkg.htmlWebpackPlugin({
      template: path('source', 'index.html')
    }),
    new pkg.cleanWebpackPlugin.CleanWebpackPlugin(),
    new pkg.miniCssExtractPlugin({
      filename: filename('css')
    }),
    ...rif(prod, [
      new pkg.terserWebpackPlugin(),
      new pkg.webpackBundleAnalyzer.BundleAnalyzerPlugin()
    ])
  ],

  devtool: dev && 'source-map',
  devServer: {
    port: 8080,
    hot: true,
    inline: true,
    publicPath: '/',
    historyApiFallback: true
  }
}
