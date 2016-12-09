/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { createNode } from '../../app/lib/NodeModifiers'
import { indexTreeNodes, addTreeNode, updateTreeNode, removeTreeNode, updateTreeNodes } from '../../app/lib/TreeModifiers'
import defaultUI from '../../app/lib/defaultUI'
import { uid, uid1, uid2, uid3, uid4 } from '../uid'

describe('TreeModifiers', () => {

  describe('indexTreeNodes', () => {

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
      const tree = indexTreeNodes(data)
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[1].nodes.length).toBe(2)
    })
  })


  describe('addTreeNode', () => {

    it('root', () => {
      const treeData = { nodes: [] }
      const node = createNode(null, { title: 'Mr. Foo' })
      const path = []
      const tree = addTreeNode(treeData, path, node)
      expect(Array.isArray(tree.nodes)).toBe(true)
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].data).toEqual({ title: 'Mr. Foo' })
    })

    it('first generation', () => {
      const treeData = { nodes: [createNode(uid, { title: 'root' })] }
      const path = [uid]
      const node = createNode(null, { title: 'Mr. Foo' })
      const tree = addTreeNode(treeData, path, node)
      expect(Array.isArray(tree.nodes[0].nodes)).toBe(true)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].data).toEqual({ title: 'Mr. Foo' })
    })

    it('root before', () => {
      const treeData = { nodes: [createNode(uid, { title: 'Root' })] }
      const path = []
      const node = createNode(null, { title: 'Mr. Foo' })
      const tree = addTreeNode(treeData, path, node, uid)
      expect(tree.nodes.length).toBe(2)
      expect(tree.nodes[0].data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[1].data).toEqual({ title: 'Root' })
    })

    it('first generation before', () => {
      const treeData = { nodes: [{ uid, nodes: [createNode(uid1, { title: 'Mr. Foo' })] }] }
      const path = [uid]
      const node = createNode(null, { title: 'Created' })
      const tree = addTreeNode(treeData, path, node, uid1)
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[0].data).toEqual({ title: 'Created' })
      expect(tree.nodes[0].nodes[1].data).toEqual({ title: 'Mr. Foo' })
    })
  })

  describe('updateTreeNode', () => {

    it('root data', () => {

      const treeData = { nodes: [{ uid, data: { title: 'Mr. Foo' }, nodes: [] }] }
      const path = [uid]
      const tree = updateTreeNode(treeData, path, { title: 'New title' })
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
      const tree = updateTreeNode(treeData, path, { title: 'New title' })
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
      const tree = updateTreeNode(treeData, path, null, ui)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].uid).toBe(uid1)
      expect(tree.nodes[0].nodes[0].ui).toEqual(ui)
    })
  })

  describe('removeTreeNode', () => {

    it('root', () => {
      const treeData = { nodes: [{ uid, nodes: [] }] }
      const path = [uid]
      const tree = removeTreeNode(treeData, path)
      expect(tree.nodes.length).toBe(0)
    })

    it('1st generation', () => {

      const treeData = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }] }] }
      const path = [uid, uid1]
      const tree = removeTreeNode(treeData, path)
      expect(tree.nodes[0].nodes.length).toBe(0)
    })
  })

  describe('updateTreeNodes', () => {

    it('data', () => {

      const treeData = { nodes: [
        { uid, data: { title: 'Mr. Foo' }, nodes: [
          { uid: uid1, data: { title: 'Mr. Foo jr.' }, nodes: [] },
          { uid: uid2, data: { title: 'Mr. Foo jr. 2' }, nodes: [] }
        ] }
      ] }
      const data = { title: 'New title' }
      const tree = updateTreeNodes(treeData, data)
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
      const tree = updateTreeNodes(treeData, null, uiNonEditing)
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
      updateTreeNodes(treeData, null, uiNonEditing)
      expect(treeData).toEqual({ nodes: [
        { uid, data: { title: 'Mr. Foo' }, ui: uiEditing, nodes: [
          { uid: uid1, ui: uiEditing, nodes: [] },
          { uid: uid2, ui: uiEditing, nodes: [] }
        ] }
      ] })
    })
  })
})
