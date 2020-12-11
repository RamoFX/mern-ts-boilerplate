// Packages
const pkg = require('gulp-load-plugins')({overridePattern: true, pattern: ['*']})



// Files
const stack = require('./stack.json')



// Helpers
const mode = process.env.NODE_ENV
const dev = mode == 'development'
const prod = mode == 'production'



// Preferences
const script_ext = stack.script + (stack.framework == 'react' && 'x')
const style_ext = stack.style

const entry = `./source/app/app.${ script_ext }`

const output = dev ? '[name].dev-[contenthash].bundle.js' : '[name].bundle.min.js'



// Main config
module.exports = {
  mode,

  entry,
  output,

  plugins,
  resolve,
  module,

  devtool: dev && 'source-map',
  devServer
}
