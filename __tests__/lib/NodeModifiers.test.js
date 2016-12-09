/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { createNode, updateNode, parseTreeNode, setPathOnNode } from '../../app/lib/NodeModifiers'
import defaultUI from '../../app/lib/defaultUI'
import { uid, uid1 } from '../uid'

describe('TreeModifiers', () => {

  describe('createNode', () => {

    it('undefined arguments', () => {
      const node = createNode()
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).not.toBe(null)
      expect(node.nodes).toEqual([])
    })

    it('null arguments', () => {
      const node = createNode(null, null, null, null)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).not.toBe(null)
      expect(node.nodes).toEqual([])
    })

    it('uid', () => {
      const node = createNode(uid)
      expect(node.uid).toBe(uid)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(null, data)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual(data)
    })

    it('ui', () => {
      const ui = { ...defaultUI, editing: true }
      const node = createNode(null, null, ui)
      expect(node.uid).toBe(null)
      expect(node.ui).toEqual(ui)
    })
  })

  describe('updateNode', () => {

    it('id', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(null, data)
      const node2 = updateNode(node, uid)
      expect(node2.uid).toBe(uid)
      expect(node2.data).toEqual({ title: 'Mr. Foo' })
      expect(node2.ui).not.toBe(null)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(null, data)
      const node2 = updateNode(node, null, { title: 'New title' })
      expect(node2.uid).toBe(null)
      expect(node2.data).toEqual({ title: 'New title' })
      expect(node2.ui).not.toBe(null)
    })

    it('ui', () => {
      const node = createNode()
      const ui = { ...defaultUI, editing: true }
      const node2 = updateNode(node, null, null, ui)
      expect(node2.uid).toBe(null)
      expect(node2.ui).not.toBe(null)
      expect(node2.ui).toEqual(ui)
    })

    it('immutable', () => {
      const node = createNode(uid)
      const data = { title: 'New title' }
      const ui = { ...defaultUI, editing: true }
      const node2 = updateNode(node, uid1, data, ui)
      expect(node2.uid).toBe(uid1)
      expect(node2.data).not.toBe(ui)
      expect(node2.ui).toEqual(ui)
      expect(node).toEqual(node)
    })
  })

  describe('parseTreeNode', () => {

    it('node', () => {
      const data = { uid, title: 'Mr. Foo' }
      const node = parseTreeNode(data)
      expect(node.uid).toBe(uid)
      expect(node.data).toEqual({ title: 'Mr. Foo' })
      expect(node.ui).not.toBe(null)
    })
  })

  describe('setPathOnNode', () => {

    it('root', () => {
      let node = createNode(uid)
      node = setPathOnNode(node, [])
      expect(node.path).toEqual([uid])
    })

    it('parent path', () => {
      let node = createNode(uid1)
      node = setPathOnNode(node, [uid])
      expect(node.path).toEqual([uid, uid1])
    })
  })
})
