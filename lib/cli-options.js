exports.optionDefinitions = [
  {
    name: 'files',
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: [],
    description: 'One or more glob patterns or filenames to process.'
  },
  {
    name: 'dry-run',
    type: Boolean,
    alias: 'd',
    description: 'Set this to do everything but rename the file. You should always set this flag until certain the output looks correct.'
  },
  {
    name: 'force',
    type: Boolean,
    description: 'If a target path exists, renamer will stop. With this flag set the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution.'
  },
  {
    name: 'view',
    type: String,
    description: 'The default view outputs one line per rename. Set `--view long` to see a longer, less condensed view and `--view diff` to include a diff.',
    typeLabel: 'long|diff'
  },
  {
    name: 'plugin',
    type: String,
    alias: 'p',
    lazyMultiple: true,
    description: 'One or more replacer plugins to use, set the `--plugin` option multiple times to build a chain. For each value, supply either: \n\na) a path to a plugin file \nb) a path to a plugin package \nc) the name of a plugin package installed in the current working directory or above or \nd) the name of a built-in plugin, either `default` or `index`. \n\nThe default plugin chain is `default` then `index`, be sure to set `-p default -p index` before your plugin if you wish to extend default behaviour.',
    plugin: true,
    defaultValue: [ 'default', 'index' ]
  },
  {
    name: 'verbose',
    type: Boolean,
    alias: 'v',
    description: 'In the output, also include names of files that were {italic not} renamed.'
  },
  {
    name: 'help',
    type: Boolean,
    alias: 'h',
    description: 'Print usage instructions.'
  }
]

exports.usageSections = function (optionDefinitions, plugins) {
  console.log(plugins)
  return [
    {
      header: 'renamer',
      content: 'Rename files in bulk.'
    },
    {
      header: 'Synopsis',
      content: '$ renamer [options] [{underline file} ...]'
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
      hide: 'files'
    },
    {
      content: 'for more detailed instructions, visit {underline https://github.com/75lb/renamer}'
    }
  ]
}
