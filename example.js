const Renamer = require('./')
const renamer = new Renamer()
renamer.on('rename-start', replaceResult => {
  console.log(replaceResult)
})
renamer.rename({
  files: [ 'script/sandbox/pics/*' ],
  find: 'pic',
  replace: 'photo',
  dryRun: true
})
