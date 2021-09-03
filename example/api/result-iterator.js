import Renamer from 'renamer'

const renamer = new Renamer()
const options = {
  files: ['./example/sandbox/pics/*'],
  find: 'pic',
  replace: 'photo',
  dryRun: true
}
for await (const result of renamer.results(options)) {
  console.log(result)
}
