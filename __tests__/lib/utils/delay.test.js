/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import delay from '../../../app/lib/utils/delay'
import noop from '../../noop'

describe('delay', () => {

  it('return timeoutID', () => {
    // TimeoutID is number > 0
    expect(delay(noop)).toBeGreaterThan(0)
  })
})
