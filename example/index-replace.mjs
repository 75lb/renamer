import Renamer from '../index.mjs'

const renamer = new Renamer()
const results = await renamer.rename({
  files: ['./example/sandbox/**'],
  replace: '{{index}}.file',
  dryRun: true
})
console.log('results', results)
