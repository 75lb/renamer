import Renamer from 'renamer'

const renamer = new Renamer()
const results = await renamer.rename({
  files: ['./example/sandbox/pics/*'],
  find: 'pic',
  replace: 'photo',
  dryRun: true
})
console.log('results', results)
