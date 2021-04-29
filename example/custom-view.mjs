class CustomView {
  start () {
    console.log('-- COMMENCE --')
  }

  log () {
    console.log('LOG')
  }

  logResult (replaceResult) {
    console.log('RESULT', replaceResult)
  }

  logError (err) {
    console.error('ERROR', err.message)
  }

  complete () {
    console.log('-- DESIST --')
  }
}

export default CustomView
