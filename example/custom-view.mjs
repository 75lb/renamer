import Renamer from '../index.mjs'

class CustomView {
  start () {
    console.log('-- COMMENCE --')
  }

  log (replaceResult) {
    console.log('LOG', replaceResult)
  }

  logError (err) {
    console.error('ERROR', err.message)
  }

  complete () {
    console.log('-- DESIST --')
  }
}
const view = new CustomView()
const renamer = new Renamer()

async function run (options) {
  try {
    view.start()
    for await (const result of renamer.resultIterator(options)) {
      view.log(result)
    }
  } catch (err) {
    view.logError(err)
  } finally {
    view.complete()
  }
}

/* succeeds */
await run({
  files: ['./example/sandbox/pics/*'],
  find: 'pic',
  replace: 'photo',
  dryRun: true,
  view: []
})

/* fails */
await run({
  files: ['./example/sandbox/pics/*'],
  pathElement: 'broken',
  find: 'pic',
  replace: 'photo',
  dryRun: true,
  view: []
})

