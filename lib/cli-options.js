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
    description: 'Optional find string (or regular expression when --regexp is set). If not set, the whole filename will be replaced.'
  },
  {
    name: 'replace',
    alias: 'r',
    type: String,
    defaultValue: '',
    description: "The replace string. With --regexp set, --replace can reference parenthesised substrings from --find with $1, $2, $3 etc. If omitted, defaults to a blank string. The special token '\\{\\{index\\}\\}' will insert an incrementing number per file processed."
  },
  {
    name: 'regexp',
    type: Boolean,
    alias: 'e',
    description: 'When set, --find is intepreted as a regular expression.'
  },
  {
    name: 'dry-run',
    type: Boolean,
    alias: 'd',
    description: 'Used for test runs. Set this to do everything but rename the file.'
  },
  {
    name: 'insensitive',
    type: Boolean,
    alias: 'i',
    description: 'Enable case-insensitive finds.'
  },
  {
    name: 'force',
    type: Boolean,
    description: 'If the target path already exists, overwrite it. Use with caution.'
  },
  {
    name: 'plugin',
    type: String,
    alias: 'p',
    lazyMultiple: true,
    description: 'Replacer function to use',
    typeLabel: '{underline module-id}'
  },
  {
    name: 'verbose',
    type: Boolean,
    alias: 'v',
    description: 'Use to print additional information.'
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
    content: 'Batch rename files and folders.'
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
