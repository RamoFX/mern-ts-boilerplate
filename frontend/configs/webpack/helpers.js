const node_path = require('path')

module.exports = {
  path: (...paths) => {
    return node_path.join(__dirname, '..', '..', ...paths)
  }
}
