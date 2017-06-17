/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import {
  getUidFromTreePath,
  getParentFromTreePath
} from '../../../app/lib/tree/TreeUtils'

import { uid1, uid2 } from '../../uid'

describe('TreeUtils', () => {

  describe('getUidFromTreePath', () => {

    it('empty array', () => {
      const uid = getUidFromTreePath([])
      expect(uid).toEqual(null)
    })

    it('uid', () => {
      const uid = getUidFromTreePath([uid1, uid2])
      expect(uid).toEqual(uid2)
    })
  })

  describe('getParentFromTreePath', () => {

    it('array length 1', () => {
      const parent = getParentFromTreePath([uid1])
      expect(parent).toEqual(null)
    })

    it('parent', () => {
      const parent = getParentFromTreePath([uid1, uid2])
      expect(parent).toEqual(uid1)
    })
  })
})
