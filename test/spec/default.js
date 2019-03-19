import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import photoUploader from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof photoUploader, 'function')
  },
  async 'calls package without error'() {
    await photoUploader()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await photoUploader({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T