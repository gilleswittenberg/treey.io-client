/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { getPrevActive } from '../../../app/lib/tree/getNextPrevActive'
import { uid, uid1, uid2, uid3, uid4 } from '../../uid'

describe('getPrevActive', () => {

  it('prev child', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1, uid2] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const prevActive = getPrevActive(nodes, [uid, uid2])
    expect(prevActive).toEqual([uid, uid1])
  })

  it('parent', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const prevActive = getPrevActive(nodes, [uid, uid1])
    expect(prevActive).toEqual([uid])
  })

  it('root circular', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid2, uid3] }
    ]
    const expanded = {
      '0': [uid],
      '1': [uid, uid1]
    }
    const prevActive = getPrevActive(nodes, [uid], expanded)
    expect(prevActive).toEqual([uid, uid1, uid3])
  })

  it('sibling with children', () => {
    const nodes = [
      { uid, data: { title: '' }, transactions: [], user: '', nodes: [uid1, uid2] },
      { uid: uid1, data: { title: '' }, transactions: [], user: '', nodes: [uid3, uid4] },
      { uid: uid2, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid3, data: { title: '' }, transactions: [], user: '', nodes: [] },
      { uid: uid4, data: { title: '' }, transactions: [], user: '', nodes: [] }
    ]
    const expanded = {
      '0': [uid],
      '1': [uid, uid1]
    }
    const prevActive = getPrevActive(nodes, [uid, uid2], expanded)
    expect(prevActive).toEqual([uid, uid1, uid4])
  })
})
