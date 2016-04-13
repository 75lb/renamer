var arrayify = require('array-back')
var testValue = require('test-value')

module.exports = Results

function Results (list) {
  this.list = list || []
  this.add = function (files) {
    var self = this
    arrayify(files).forEach(function (file) {
      if (!testValue(self.list, { before: file })) {
        self.list.push({ before: file })
      }
    })
  }
  this.beforeList = function () {
    return this.list.map(function (item) {
      return item.before
    })
  }
  this.afterList = function () {
    return pluck(this.list, 'after', 'before')
  }
}

function pluck (arrayOfObjects, property, property2, property3) {
  if (!Array.isArray(arrayOfObjects)) throw new Error('.pluck() input must be an array')

  return arrayOfObjects
    .filter(function (obj) {
      var one = eval('obj.' + property)
      var two = eval('obj.' + property2)
      var three = eval('obj.' + property3)
      return one || two || three
    })
    .map(function (obj) {
      var one = eval('obj.' + property)
      var two = eval('obj.' + property2)
      var three = eval('obj.' + property3)
      return one || two || three
    })
}
