/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { getNextActive } from '../../../app/lib/tree/getNextPrevActive'
import { uuid, uuid1, uuid2, uuid3 } from '../../uuid'

describe('getNextActive', () => {

  it('root', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid], { '0': [uuid] })
    expect(nextActive).toEqual([uuid, uuid1])
  })

  it('root, first child', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1, uuid2] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1])
    expect(nextActive).toEqual([uuid, uuid2])
  })

  it('root, second child', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1, uuid2, uuid3] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid2])
    expect(nextActive).toEqual([uuid, uuid3])
  })

  it('root, first child, first grandchild', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1], { '0': [uuid], '1': [uuid, uuid1] })
    expect(nextActive).toEqual([uuid, uuid1, uuid2])
  })

  it('root, first child, second child', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1, uuid3] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1, uuid2])
    expect(nextActive).toEqual([uuid, uuid3])
  })

  it('root, first child, first grandchild, first grandgrandchild', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2, uuid3] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1, uuid2])
    expect(nextActive).toEqual([uuid, uuid1, uuid3])
  })

  it('circular root', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1, uuid2])
    expect(nextActive).toEqual([uuid])
  })

  it('multiple children', () => {
    const nodes = [
      { uuid, data: { title: '' }, transactions: [], user: '', nodes: [uuid1] },
      { uuid: uuid1, data: { title: '' }, transactions: [], user: '', nodes: [uuid2, uuid3] },
      { uuid: uuid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uuid: uuid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uuid, uuid1, uuid3])
    expect(nextActive).toEqual([uuid])
  })
})
