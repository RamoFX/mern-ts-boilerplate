const allowedModes = ['dev', 'prod']

if (allowedModes.includes(mode)) {
  const webpackMerge = require('webpack-merge')

  const mode = process.env.NODE_ENV
  const dev = mode == 'development'
  const prod = !dev

  const configs = {
    base: require('./base.js'),
    dev: require('./env/dev.js'),
    prod: require('./env/prod.js')
  }

  module.exports = webpackMerge(base, config[mode])
} else {
  console.error('Unsupported webpack enviroment mode.')
  console.error(`process.env.NODE_ENV == ${ process.env.NODE_ENV }`)
  console.trace()
}
