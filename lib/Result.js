module.exports = Result

function Result (options) {
  if (options.before) this.before = options.before
  if (options.after) this.after = options.after
  if (options.renamed) this.renamed = options.renamed
  if (options.error) this.error = options.error
  if (options.stat) this.stat = options.stat
}
