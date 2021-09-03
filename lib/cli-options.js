const optionDefinitions = [
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
    description: 'Use one of the built-in views ("long", "diff", "one-line") or supply a path to a custom view. The default view outputs one line per rename. Set `--view long` to see a longer, less condensed view and `--view diff` to include a diff. Use `--view one-line` to output the summary line only.'
  },
  {
    name: 'chain',
    type: String,
    alias: 'c',
    /*
    Must be lazyMultiple else this command would parse all js files as chain plugins.
    renamer --chain index-replace.js --chain ./test/lib/dummy-plugin.js *.js -d
    */
    lazyMultiple: true,
    description: 'One or more replace chain plugins to use, set the `--chain` option multiple times to build a chain. For each value, supply either: a) a path to a plugin file b) a path to an installed plugin package or c) the name of a built-in plugin, either `find-replace` or `index-replace`. The default plugin chain is `find-replace` then `index-replace`.',
    plugin: true
  },
  {
    name: 'silent',
    type: Boolean,
    alias: 's',
    description: 'Silent mode.'
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

async function usageSections (allOptionDefinitions, plugins) {
  const sections = [
    {
      header: 'renamer',
      content: 'Rename files in bulk.'
    },
    {
      header: 'Synopsis',
      content: '$ renamer [options] [{underline file} ...]'
    },
    {
      header: 'General options',
      optionList: optionDefinitions,
      hide: 'files'
    },
    {
      header: 'Replace chain',
      content: plugins.length
        ? plugins.map(p => ({
            name: '↓ ' + p.constructor.name,
            desc: p.description && p.description()
          }))
        : '{italic Replace chain empty, supply one or more plugins using --chain.}'
    }
  ]

  for (const plugin of plugins) {
    const pluginDefinitions = plugin.optionDefinitions()
    if (pluginDefinitions.length) {
      sections.push({
        header: 'Plugin: ' + plugin.constructor.name,
        optionList: pluginDefinitions
      })
    }
  }

  sections.push({
    content: 'For detailed instructions, visit {underline https://github.com/75lb/renamer}'
  })
  return sections
}

export { optionDefinitions, usageSections }
