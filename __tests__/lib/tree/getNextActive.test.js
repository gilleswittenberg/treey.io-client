/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { getNextActive } from '../../../app/lib/tree/getNextPrevActive'
import { uid, uid1, uid2, uid3 } from '../../uid'

describe('getNextActive', () => {

  it('root', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid], { '0': [uid] })
    expect(nextActive).toEqual([uid, uid1])
  })

  it('root, first child', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1, uid2] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1])
    expect(nextActive).toEqual([uid, uid2])
  })

  it('root, second child', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1, uid2, uid3] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid2])
    expect(nextActive).toEqual([uid, uid3])
  })

  it('root, first child, first grandchild', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1], { '0': [uid], '1': [uid, uid1] })
    expect(nextActive).toEqual([uid, uid1, uid2])
  })

  it('root, first child, second child', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1, uid3] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1, uid2])
    expect(nextActive).toEqual([uid, uid3])
  })

  it('root, first child, first grandchild, first grandgrandchild', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2, uid3] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1, uid2])
    expect(nextActive).toEqual([uid, uid1, uid3])
  })

  it('circular root', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1, uid2])
    expect(nextActive).toEqual([uid])
  })

  it('multiple children', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2, uid3] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid3, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const nextActive = getNextActive(nodes, [uid, uid1, uid3])
    expect(nextActive).toEqual([uid])
  })
})
