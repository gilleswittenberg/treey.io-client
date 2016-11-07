import delay from '../../app/lib/delay'
import noop from '../noop'

describe('delay', () => {

  it('return timeoutID', () => {
    expect(delay(noop)).toBeGreaterThan(0) // timeoutID is number > 0
  })
})
