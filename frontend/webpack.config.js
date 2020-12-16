const allowedModes = ['development', 'production']

const mode = process.env.NODE_ENV

if (allowedModes.includes(mode)) {
  const { merge } = require('webpack-merge')

  const configs = {
    base: require('./configs/webpack/base.js'),
    development: require('./configs/webpack/env/dev.js'),
    production: require('./configs/webpack/env/prod.js')
  }

  module.exports = merge(configs.base, configs[mode])
} else {
  console.error('Unsupported enviroment mode.')
  console.error(`Allowed are ${ allowedModes }, but you have ${ process.env.NODE_ENV }`)
  console.trace(this)
}
