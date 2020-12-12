// Packages
const pkg = require('gulp-load-plugins')({overridePattern: true, pattern: ['*']})



// Files
const prefs = require('../project.config.json')



// Helpers
const mode = process.env.NODE_ENV
const dev = mode == 'development'
const prod = mode == 'production'

const path = items => [__dirname, ...(items || [])].flat().join('/')

const filename = ext => `[name]${ dev && '-[contenthash]' }.bundle.min.${ ext }`

// Return object if condition else return empty object of the same type
const rif = (cond, obj) => {
  const obj_empty = Array.isArray(obj) ? [] : {}
  return cond ? obj : obj_empty
}

const loaders = (type, extraLoader = [], extraPreset = []) => {
  if (type == 'script') {
    return [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            ...extraPreset
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      ...extraLoader
    ]
  } else if (type == 'style') {
    return [
      {
        loader: plugin.miniCssExtractPlugin.loader,
        options: {
          hmr: development,
          reloadAll: true
        }
      },
      'css-loader',
      ...extraLoader
    ]
  } else if (type == 'img') {
    return [
      {
        loader: 'file-loader'
      },
      ...extraLoader
    ]
  }
}



// Preferences
const script_ext = `${ prefs.frontend.languages.script }${ prefs.frontend.stack.framework == 'react' && 'x' }`
const entryFile_name = `index.${ script_ext }`
const style_ext = prefs.frontend.languages.style



// Main config
module.exports = {
  mode,

  context: path(''),

  entry: path('source', 'app', entryFile_name),
  output: {
    path: path('production'),
    filename: filename('js')
  },

  module: [
    {
      test: '',
      use: {
        loaders: [
          {
            use: []
          }
        ]
      }
    }
  ],

  resolve: {
    extensions: [],
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
    inline: true,
    publicPath: '/',
    historyApiFallback: true
  }
}
