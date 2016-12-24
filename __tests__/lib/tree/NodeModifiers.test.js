/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { createNode, updateNode, parseNode } from '../../../app/lib/tree/NodeModifiers'
import defaultUI from '../../../app/lib/ui/defaultUI'
import { uid, uid1 } from '../../uid'

describe('TreeModifiers', () => {

  describe('createNode', () => {

    it('undefined arguments', () => {
      const node = createNode()
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('undefined arguments', () => {
      const node = createNode(undefined, undefined, undefined)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('uid', () => {
      const node = createNode(uid)
      expect(node.uid).toBe(uid)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, data)
      expect(node.data).toEqual(data)
    })

    it('ui', () => {
      const ui = { ...defaultUI, editing: true }
      const node = createNode(undefined, undefined, ui)
      expect(node.ui).toEqual(ui)
    })
  })

  describe('updateNode', () => {

    it('id', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, data)
      const node2 = updateNode(node, uid)
      expect(node2.uid).toBe(uid)
      expect(node2.data).toEqual({ title: 'Mr. Foo' })
      expect(node2.ui).toEqual(defaultUI)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, data)
      const node2 = updateNode(node, undefined, { title: 'New title' })
      expect(node2.uid).toBe(null)
      expect(node2.data).toEqual({ title: 'New title' })
      expect(node2.ui).toEqual(defaultUI)
    })

    it('ui', () => {
      const node = createNode()
      const ui = { ...defaultUI, editing: true }
      const node2 = updateNode(node, undefined, undefined, ui)
      expect(node2.uid).toBe(null)
      expect(node2.data).toEqual({ title: '' })
      expect(node2.ui).toEqual(ui)
    })

    it('immutable', () => {
      const node = createNode(uid)
      const data = { title: 'New title' }
      const ui = { ...defaultUI, editing: true }
      const node2 = updateNode(node, uid1, data, ui)
      expect(node.uid).toEqual(uid)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
      expect(node2.uid).toBe(uid1)
      expect(node2.data).toEqual({ title: 'New title' })
      expect(node2.ui).toEqual(ui)
    })
  })

  describe('parseNode', () => {

    it('node', () => {
      const data = { uid, data: { title: 'Mr. Foo' } }
      const node = parseNode(data)
      expect(node.uid).toBe(uid)
      expect(node.data).toEqual({ title: 'Mr. Foo' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('uid undefined', () => {
      const data = { data: { title: 'Mr. Foo' } }
      const node = parseNode(data)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: 'Mr. Foo' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('title undefined', () => {
      const node = parseNode({ data: undefined })
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
    })
  })
})
