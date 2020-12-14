const allowedModes = ['development', 'production']

const mode = process.env.NODE_ENV
const dev = mode == 'development'
const prod = !dev

if (allowedModes.includes(mode)) {
  const { merge } = require('webpack-merge')

  const configs = {
    base: require('./base.js'),
    development: require('./env/dev.js'),
    production: require('./env/prod.js')
  }

  module.exports = merge(configs.base, configs[mode])
} else {
  console.error('Unsupported webpack enviroment mode.')
  console.error(`process.env.NODE_ENV == ${ process.env.NODE_ENV }`)
  console.trace()
}
