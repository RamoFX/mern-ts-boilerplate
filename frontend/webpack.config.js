// Main definitions
const yes = true
const no = false



// Packages
const pkg = require('gulp-load-plugins')({overridePattern: true, pattern: ['*']})



// Preferences
const localConfig = {
  analyzeBundle: no
}

const mode = process.env.NODE_ENV
const dev = mode == 'development'
const prod = mode == 'production'

const projectConfig = require('../project.config.json')
const script = projectConfig.frontend.languages.script
const style = projectConfig.frontend.languages.style
const framework = projectConfig.frontend.stack.framework

const script_ext = `${ script }${ framework == 'react' ? 'x' : '' }`



// Helpers
const flat = array => array.flat()

const path = (...items) => {
  items = items || []

  return flat([__dirname, ...items]).join('/')
}

const filename = ext => {
  const hash = dev ? '-[contenthash]' : ''
  const min_ext = prod ? '.min' : ''

  return `[name]${ hash }.bundle${ min_ext }.${ ext }`
}

const module_obj = (test, use, exclude = /node_modules/) => ({
  test,
  use: flat(use),
  exclude
})

// ReturnIF: Return object or array if condition else return empty object or array of the same type
const rif = (cond, obj) => {
  const obj_empty = Array.isArray(obj) ? [] : {}
  return cond ? obj : obj_empty
}

const entryFile_name = `index.${ script_ext }`

const regexpWrap = (regexp_raw, includeDot = yes) => new RegExp(`${ includeDot ? '\\.' : '' }${ regexp_raw }$`)

const scriptModule = () => {
  const is_js = script == 'js'

  const scriptExt = is_js ? script : `(${ script })|(js)`
  const frameworkExtAdd = framework == 'react' ? 'x?' : ''

  const test = regexpWrap(scriptExt + frameworkExtAdd)

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
  ])
}

const styleModule = () => {
  const css_regexp_raw = 'css'
  const sass_regexp_raw = 's[ac]ss'

  const is_sass = regexpWrap(sass_regexp_raw, no).test(style)

  const test = is_sass ? regexpWrap(sass_regexp_raw) : regexpWrap(css_regexp_raw)

  return module_obj(test, [
    pkg.miniCssExtractPlugin.loader,
    'css-loader',
    is_sass ? 'sass-loader' : []
  ])
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
    extensions: flat([
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
    ]),
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
      localConfig.analyzeBundle ? new pkg.webpackBundleAnalyzer.BundleAnalyzerPlugin() : []
    ].flat())
  ],

  devtool: dev && 'source-map',
  devServer: {
    port: 8080,
    hot: true,
    inline: true,
    publicPath: '/',
    historyApiFallback: true
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      usedExports: true
    }
  }
}
