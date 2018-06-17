exports.optionDefinitions = [
  {
    name: 'files',
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: [],
    description: 'The files to rename. This is the default option.'
  },
  {
    name: 'find',
    alias: 'f',
    type: String,
    description: 'Optional find string (e.g. "one") or regular expression literal (e.g. "/one/i"). If omitted, the whole filename will be matched and replaced.'
  },
  {
    name: 'replace',
    alias: 'r',
    type: String,
    defaultValue: '',
    description: "The replace string. If omitted, defaults to a empty string. The special token '\\{\\{index\\}\\}' will insert a number, incremented each time a file is replaced."
  },
  {
    name: 'dry-run',
    type: Boolean,
    alias: 'd',
    description: 'Used for test runs. Set this to do everything but rename the file.'
  },
  {
    name: 'force',
    type: Boolean,
    description: 'If the target path already exists, overwrite it. Use with caution.'
  },
  // {
  //   name: 'plugin',
  //   type: String,
  //   alias: 'p',
  //   lazyMultiple: true,
  //   description: 'Replacer function to use',
  //   typeLabel: '{underline module-id}'
  // },
  {
    name: 'verbose',
    type: Boolean,
    alias: 'v',
    description: 'In the output, also include names of files that were not renamed.'
  },
  {
    name: 'help',
    type: Boolean,
    alias: 'h',
    description: 'Print usage instructions.'
  }
]

exports.usageSections = [
  {
    header: 'renamer',
    content: 'Rename files in bulk.'
  },
  {
    header: 'Synopsis',
    content: '$ renamer [options] <files>'
  },
  {
    header: 'Options',
    optionList: exports.optionDefinitions,
    hide: 'files'
  },
  {
    content: 'for more detailed instructions, visit {underline https://github.com/75lb/renamer}'
  }
]
