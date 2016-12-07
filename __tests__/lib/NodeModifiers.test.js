/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { create, update, parse, setPath } from '../../app/lib/NodeModifiers'
import defaultUI from '../../app/lib/defaultUI'

describe('TreeModifiers', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'

  describe('create', () => {

    it('undefined arguments', () => {
      const node = create()
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).not.toBe(null)
      expect(node.nodes).toEqual([])
    })

    it('null arguments', () => {
      const node = create(null, null, null, null)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).not.toBe(null)
      expect(node.nodes).toEqual([])
    })

    it('uid', () => {
      const node = create(uid)
      expect(node.uid).toBe(uid)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = create(null, data)
      expect(node.uid).toBe(null)
      expect(node.data).toEqual(data)
    })

    it('ui', () => {
      const ui = { ...defaultUI, editing: true }
      const node = create(null, null, ui)
      expect(node.uid).toBe(null)
      expect(node.ui).toEqual(ui)
    })
  })

  describe('update', () => {

    it('id', () => {
      const data = { title: 'Mr. Foo' }
      const node = create(null, data)
      const node2 = update(node, uid)
      expect(node2.uid).toBe(uid)
      expect(node2.data).toEqual({ title: 'Mr. Foo' })
      expect(node2.ui).not.toBe(null)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = create(null, data)
      const node2 = update(node, null, { title: 'New title' })
      expect(node2.uid).toBe(null)
      expect(node2.data).toEqual({ title: 'New title' })
      expect(node2.ui).not.toBe(null)
    })

    it('ui', () => {
      const node = create()
      const ui = { ...defaultUI, editing: true }
      const node2 = update(node, null, null, ui)
      expect(node2.uid).toBe(null)
      expect(node2.ui).not.toBe(null)
      expect(node2.ui).toEqual(ui)
    })

    it('immutable', () => {
      const node = create(uid)
      const data = { title: 'New title' }
      const ui = { ...defaultUI, editing: true }
      const node2 = update(node, uid1, data, ui)
      expect(node2.uid).toBe(uid1)
      expect(node2.data).not.toBe(ui)
      expect(node2.ui).toEqual(ui)
      expect(node).toEqual(node)
    })
  })

  describe('parse', () => {

    it('node', () => {
      const data = { uid, title: 'Mr. Foo' }
      const node = parse(data)
      expect(node.uid).toBe(uid)
      expect(node.data).toEqual({ title: 'Mr. Foo' })
      expect(node.ui).not.toBe(null)
    })
  })

  describe('setPath', () => {

    it('root', () => {
      let node = create(uid)
      node = setPath(node, [])
      expect(node.path).toEqual([uid])
    })

    it('parent path', () => {
      let node = create(uid1)
      node = setPath(node, [uid])
      expect(node.path).toEqual([uid, uid1])
    })
  })
})
