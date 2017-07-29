/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import getNextSibling from '../../../app/lib/ui/getNextSibling'
import { uuid, uuid1, uuid2, uuid3 } from '../../uuid'

describe('getNextSibling', () => {

  it('empty array', () => {
    expect(getNextSibling([], 0)).toBe(null)
  })

  it('out of range index', () => {
    expect(getNextSibling([uuid], 2)).toBe(null)
  })

  it('last index', () => {
    expect(getNextSibling([uuid, uuid1, uuid2], 2)).toBe(null)
  })

  it('sibling', () => {
    expect(getNextSibling([uuid, uuid1], 0)).toBe(uuid1)
  })

  it('sibling 2', () => {
    expect(getNextSibling([uuid, uuid1, uuid2, uuid3], 2)).toBe(uuid3)
  })
})
