class CustomView {
  start () {
    console.log('-- COMMENCE --')
  }

  log () {
    console.log('LOG')
  }

  logInfo (info) {
    console.log('INFO', info)
  }

  logResult (result) {
    console.log('RESULT', result)
  }

  logError (err) {
    console.error('ERROR', err.message)
  }

  complete () {
    console.log('-- DESIST --')
  }

  write (key, value, options) {
    const methodMap = {
      info: 'logInfo',
      usage: 'log',
      result: 'logResult',
      error: 'logError',
      start: 'start',
      complete: 'complete',
    }
    const method = methodMap[key]
    if (this[method]) {
      this[method](value, options)
    }
  }
}

export default CustomView
