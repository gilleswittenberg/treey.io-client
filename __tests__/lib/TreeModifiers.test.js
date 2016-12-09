/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { create } from '../../app/lib/NodeModifiers'
import { indexNodes, addNode, updateNode, removeNode, updateNodes } from '../../app/lib/TreeModifiers'
import defaultUI from '../../app/lib/defaultUI'

describe('TreeModifiers', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'
  const uid4 = '57bedc40e81b0620300d7694'

  describe('indexNodes', () => {

    it('parse', () => {
      const data = {
        uid,
        title: 'Mr. Foo',
        nodes : [
          { uid: uid1, title: 'First child' },
          { uid: uid2, title: 'Second child', nodes: [
            { uid: uid3, title: 'First grandchild' },
            { uid: uid4, title: 'Second grandchild' }
          ] }
        ]
      }
      const tree = indexNodes(data)
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[1].nodes.length).toBe(2)
    })
  })


  describe('addNode', () => {

    it('root', () => {
      const treeData = { nodes: [] }
      const node = create(null, { title: 'Mr. Foo' })
      const path = []
      const tree = addNode(treeData, path, node)
      expect(Array.isArray(tree.nodes)).toBe(true)
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].data).toEqual({ title: 'Mr. Foo' })
    })

    it('first generation', () => {
      const treeData = { nodes: [create(uid, { title: 'root' })] }
      const path = [uid]
      const node = create(null, { title: 'Mr. Foo' })
      const tree = addNode(treeData, path, node)
      expect(Array.isArray(tree.nodes[0].nodes)).toBe(true)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].data).toEqual({ title: 'Mr. Foo' })
    })

    it('root before', () => {
      const treeData = { nodes: [create(uid, { title: 'Root' })] }
      const path = []
      const node = create(null, { title: 'Mr. Foo' })
      const tree = addNode(treeData, path, node, uid)
      expect(tree.nodes.length).toBe(2)
      expect(tree.nodes[0].data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[1].data).toEqual({ title: 'Root' })
    })

    it('first generation before', () => {
      const treeData = { nodes: [{ uid, nodes: [create(uid1, { title: 'Mr. Foo' })] }] }
      const path = [uid]
      const node = create(null, { title: 'Created' })
      const tree = addNode(treeData, path, node, uid1)
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[0].data).toEqual({ title: 'Created' })
      expect(tree.nodes[0].nodes[1].data).toEqual({ title: 'Mr. Foo' })
    })
  })

  describe('updateNode', () => {

    it('root data', () => {

      const treeData = { nodes: [{ uid, data: { title: 'Mr. Foo' }, nodes: [] }] }
      const path = [uid]
      const tree = updateNode(treeData, path, { title: 'New title' })
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].uid).toBe(uid)
      expect(tree.nodes[0].data).toEqual({ title: 'New title' })
    })

    it('1st generation data', () => {

      const treeData = {
        nodes: [{
          uid,
          data: { title: 'Mr. Foo' },
          nodes: [{ uid: uid1, data: { title: '1st child' }, nodes: [] }]
        }]
      }
      const path = [uid, uid1]
      const tree = updateNode(treeData, path, { title: 'New title' })
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].uid).toBe(uid1)
      expect(tree.nodes[0].nodes[0].data).toEqual({ title: 'New title' })
    })

    it('1st generation ui', () => {

      const treeData = {
        nodes: [{
          uid,
          ui: defaultUI,
          nodes: [{ uid: uid1, ui: defaultUI, nodes: [] }]
        }]
      }
      const path = [uid, uid1]
      const ui = { ...defaultUI, editing: true }
      const tree = updateNode(treeData, path, null, ui)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].uid).toBe(uid1)
      expect(tree.nodes[0].nodes[0].ui).toEqual(ui)
    })
  })

  describe('removeNode', () => {

    it('root', () => {
      const treeData = { nodes: [{ uid, nodes: [] }] }
      const path = [uid]
      const tree = removeNode(treeData, path)
      expect(tree.nodes.length).toBe(0)
    })

    it('1st generation', () => {

      const treeData = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }] }] }
      const path = [uid, uid1]
      const tree = removeNode(treeData, path)
      expect(tree.nodes[0].nodes.length).toBe(0)
    })
  })

  describe('updateNodes', () => {

    it('data', () => {

      const treeData = { nodes: [
        { uid, data: { title: 'Mr. Foo' }, nodes: [
          { uid: uid1, data: { title: 'Mr. Foo jr.' }, nodes: [] },
          { uid: uid2, data: { title: 'Mr. Foo jr. 2' }, nodes: [] }
        ] }
      ] }
      const data = { title: 'New title' }
      const tree = updateNodes(treeData, data)
      expect(tree.nodes[0].data).toEqual(data)
      expect(tree.nodes[0].nodes[0].data).toEqual(data)
      expect(tree.nodes[0].nodes[1].data).toEqual(data)
    })

    it('ui', () => {

      const uiEditing = { ...defaultUI, editing: true }
      const treeData = { nodes: [
        { uid, data: { title: 'Mr. Foo' }, ui: uiEditing, nodes: [
          { uid: uid1, ui: uiEditing, nodes: [] },
          { uid: uid2, ui: uiEditing, nodes: [] }
        ] }
      ] }
      const uiNonEditing = { ...defaultUI, editing: false }
      const tree = updateNodes(treeData, null, uiNonEditing)
      expect(tree.nodes[0].ui).toEqual(uiNonEditing)
      expect(tree.nodes[0].nodes[0].ui).toEqual(uiNonEditing)
      expect(tree.nodes[0].nodes[1].ui).toEqual(uiNonEditing)
    })

    it('immutable', () => {

      const uiEditing = { ...defaultUI, editing: true }
      const treeData = { nodes: [
        { uid, data: { title: 'Mr. Foo' }, ui: uiEditing, nodes: [
          { uid: uid1, ui: uiEditing, nodes: [] },
          { uid: uid2, ui: uiEditing, nodes: [] }
        ] }
      ] }
      const uiNonEditing = { ...defaultUI, editing: false }
      updateNodes(treeData, null, uiNonEditing)
      expect(treeData).toEqual({ nodes: [
        { uid, data: { title: 'Mr. Foo' }, ui: uiEditing, nodes: [
          { uid: uid1, ui: uiEditing, nodes: [] },
          { uid: uid2, ui: uiEditing, nodes: [] }
        ] }
      ] })
    })
  })
})
