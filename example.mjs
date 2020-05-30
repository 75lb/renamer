const Renamer = require('./')
const renamer = new Renamer()
renamer.on('replace-result', replaceResult => {
  console.log(replaceResult)
})
renamer.rename({
  files: ['script/sandbox/pics/*'],
  find: 'pic',
  replace: 'photo',
  dryRun: true
})
