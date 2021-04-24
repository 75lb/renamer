import Renamer from './index.mjs'
const renamer = new Renamer()
renamer.on('replace-result', replaceResult => {
  console.log(replaceResult)
})
await renamer.rename({
  files: ['script/sandbox/pics/*'],
  find: 'pic',
  replace: 'photo',
  dryRun: true
})
