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

// Return object if condition else return empty object of the same type
const rif = (cond, obj) => {
  const obj_empty = Array.isArray(obj) ? [] : {}
  return cond ? obj : obj_empty
}



// Preferences
const frontendConfig = projectConfig.frontend

const script = frontendConfig.languages.script
const style = frontendConfig.languages.style
const framework = frontendConfig.stack.framework

const script_ext = `${ script }${ framework == 'react' && 'x' }`

const entryFile_name = `index.${ script_ext }`



// Sugar
const module_obj = (test, use, exclude = /node_modules/) => ({
  test,
  use,
  exclude
})

const scriptModule = (regexp, ...extraLoaders) => module_obj(regexp, [
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
  ...(extraLoaders || [])
])

const styleModule = (regexp, ...extraLoaders) => module_obj(regexp, [
  {
    loader: pkg.miniCssExtractPlugin.loader,
    options: {
      hmr: dev,
      reloadAll: true
    }
  },
  'css-loader',
  ...(extraLoaders || [])
])



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
      // Script
      scriptModule(/\.jsx?$/),
      rif(
        script == 'ts',
        scriptModule(/\.tsx?$/, 'ts-loader')
      ),

      // Style
      styleModule(/\.css$/),
      rif(
        /\.s[ac]ss$/.test(style),
        styleModule(/\.s[ac]ss$/, 'sass-loader')
      ),

      // Other
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
    inline: true,
    publicPath: '/',
    historyApiFallback: true
  }
}
