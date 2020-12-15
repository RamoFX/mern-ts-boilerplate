const node_path = require('path')

const helpers = {
  path: (...paths) => {
    return node_path.join(__dirname, '..', '..', ...(paths || []))
  }
}

module.exports = helpers
