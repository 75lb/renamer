/**
 * Search globally by default. If `options.regexp` is not set then ensure any special regex characters in `options.find` are escaped. Do nothing if `options.find` is not set.
 */
function regExpBuilder (options) {
  if (options.find) {
    const re = options.regexp ? options.find : this.escapeRegExp(options.find)
    const reOptions = 'g' + (options.insensitive ? 'i' : '')
    return new RegExp(re, reOptions)
  } else {
    return null
  }
}

function escapeRegExp (string) {
  return string
    ? string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
    : ''
}

function loadModule (moduleId, options) {
  options = Object.assign({ paths: [ process.cwd() ] }, options)
  if (typeof moduleId === 'string') {
    return require(require.resolve(moduleId, { paths: options.paths }))
  } else {
    throw new Error('moduleId string expected')
  }
}

exports.regExpBuilder = regExpBuilder
exports.escapeRegExp = escapeRegExp
exports.loadModule = loadModule
