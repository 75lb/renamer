import DefaultView from '../../lib/view/default.js'
import a from 'node:assert/strict'
import TestRunner from 'test-runner'

const tom = new TestRunner.Tom()

tom.test('default view output is correct', async function () {
  const view = new DefaultView()
  a.equal(view.createResultLine({ renamed: true, from: 'one', to: 'two' }), '\u001b[32m✔︎\u001b[39m one\u001b[1m → \u001b[22mtwo ')
  a.equal(view.createResultLine({ renamed: false, from: 'one', to: 'two' }, { verbose: true }), '\u001b[31m✖\u001b[39m one ')
  a.equal(view.createResultLine({ renamed: false, from: 'one', to: 'two', error: 'failed' }, { verbose: true }), '\u001b[31m✖\u001b[39m one (\u001b[31mfailed\u001b[39m)')
})

export default tom

