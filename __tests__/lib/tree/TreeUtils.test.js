/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import {
  getNodeFromTreePath,
  getParentFromTreePath
} from '../../../app/lib/tree/TreeUtils'

import { uuid1, uuid2 } from '../../uuid'

describe('TreeUtils', () => {

  describe('getNodeFromTreePath', () => {

    it('empty array', () => {
      const node = getNodeFromTreePath([])
      expect(node).toEqual(null)
    })

    it('uuid', () => {
      const node = getNodeFromTreePath([uuid1, uuid2])
      expect(node).toEqual(uuid2)
    })
  })

  describe('getParentFromTreePath', () => {

    it('array length 1', () => {
      const parent = getParentFromTreePath([uuid1])
      expect(parent).toEqual(null)
    })

    it('parent', () => {
      const parent = getParentFromTreePath([uuid1, uuid2])
      expect(parent).toEqual(uuid1)
    })
  })
})
