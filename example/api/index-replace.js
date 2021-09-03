import Renamer from '../../index.js'

const renamer = new Renamer()
const results = await renamer.rename({
  files: ['./example/sandbox/**'],
  replace: '{{index}}.file',
  dryRun: true,
  chain: 'find-replace'
})
console.log('results', results)
