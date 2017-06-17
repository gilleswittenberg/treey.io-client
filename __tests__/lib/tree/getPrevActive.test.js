/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { getPrevActive } from '../../../app/lib/tree/getNextPrevActive'
import { uuid, uuid1, uuid2, uuid3, uuid4 } from '../../uuid'

describe('getPrevActive', () => {

  it('prev child', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1, uuid2] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const prevActive = getPrevActive(nodes, [uuid, uuid2])
    expect(prevActive).toEqual([uuid, uuid1])
  })

  it('parent', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const prevActive = getPrevActive(nodes, [uuid, uuid1])
    expect(prevActive).toEqual([uuid])
  })

  it('root circular', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2, uuid3] }
    ]
    const expanded = {
      '0': [uuid],
      '1': [uuid, uuid1]
    }
    const prevActive = getPrevActive(nodes, [uuid], expanded)
    expect(prevActive).toEqual([uuid, uuid1, uuid3])
  })

  it('sibling with children', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1, uuid2] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid3, uuid4] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid3, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid4, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const expanded = {
      '0': [uuid],
      '1': [uuid, uuid1]
    }
    const prevActive = getPrevActive(nodes, [uuid, uuid2], expanded)
    expect(prevActive).toEqual([uuid, uuid1, uuid4])
  })
})
