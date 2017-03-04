/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { createNode } from '../../../app/lib/tree/NodeModifiers'
import { createTreeNode } from '../../../app/lib/tree/TreeNodeModifiers'
import {
  indexTreeNodes,
  addTreeNode,
  updateTreeNode,
  removeTreeNode,
  updateTreeNodes
} from '../../../app/lib/tree/TreeModifiers'
import defaultUI from '../../../app/lib/ui/defaultUI'
import { uid, uid1, uid2, uid3, uid4 } from '../../uid'

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
      expect(tree.nodes[0].path).toEqual([uid])
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[0].path).toEqual([uid, uid1])
      expect(tree.nodes[0].nodes[1].path).toEqual([uid, uid2])
      expect(tree.nodes[0].nodes[1].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[1].nodes[0].path).toEqual([uid, uid2, uid3])
      expect(tree.nodes[0].nodes[1].nodes[1].path).toEqual([uid, uid2, uid4])
    })
  })


  describe('addTreeNode', () => {

    it('root', () => {
      const treeData = { nodes: [] }
      const node = createNode(uid, undefined, { title: 'Mr. Foo' })
      const treeNode = createTreeNode(node, [])
      const tree = addTreeNode(treeData, [], treeNode)
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].node.data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[0].node.uid).toBe(uid)
      expect(tree.nodes[0].path).toEqual([uid])
    })

    it('first generation', () => {
      const treeData = { nodes: [createTreeNode(createNode(uid, undefined, { title: 'root' }))] }
      const node = createNode(uid1, undefined, { title: 'Mr. Foo' })
      const treeNode = createTreeNode(node)
      const tree = addTreeNode(treeData, [uid], treeNode)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].node.data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[0].nodes[0].path).toEqual([uid, uid1])
    })

    it('root before', () => {
      const treeData = { nodes: [createTreeNode(createNode(uid, undefined, { title: 'Root' }))] }
      const path = []
      const node = createNode(uid1, undefined, { title: 'Mr. Foo' })
      const treeNode = createTreeNode(node)
      const tree = addTreeNode(treeData, path, treeNode, uid)
      expect(tree.nodes.length).toBe(2)
      expect(tree.nodes[0].node.data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[0].path).toEqual([uid1])
      expect(tree.nodes[1].node.data).toEqual({ title: 'Root' })
      expect(tree.nodes[1].path).toEqual([uid])
    })

    it('first generation before', () => {
      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: '' }, ui: defaultUI, transactions: [] },
        path: [uid],
        nodes: [{
          node: { uid: uid1, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] },
          path: [uid, uid1],
          nodes: []
        }]
      }] }
      const path = [uid]
      const node = createNode(uid2, undefined, { title: 'Created' })
      const treeNode = createTreeNode(node)
      const tree = addTreeNode(treeData, path, treeNode, uid1)
      expect(tree.nodes[0].nodes.length).toBe(2)
      expect(tree.nodes[0].nodes[0].node.data).toEqual({ title: 'Created' })
      expect(tree.nodes[0].nodes[0].path).toEqual([uid, uid2])
      expect(tree.nodes[0].nodes[1].node.data).toEqual({ title: 'Mr. Foo' })
      expect(tree.nodes[0].nodes[1].path).toEqual([uid, uid1])
    })

    it('update path recursively', () => {
      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: '' }, ui: defaultUI, transactions: [] },
        path: [uid],
        nodes: [{
          node: { uid: uid1, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] },
          path: [uid, uid1],
          nodes: []
        }]
      }] }
      const path = [uid]
      const node = createNode(uid2, undefined, { title: 'Created' })
      const treeNodes = [createTreeNode(createNode(uid3)), createTreeNode(createNode(uid4))]
      const treeNode = createTreeNode(node, undefined, treeNodes)
      const tree = addTreeNode(treeData, path, treeNode)
      expect(tree.nodes[0].nodes[0].path).toEqual([uid, uid1])
      expect(tree.nodes[0].nodes[1].path).toEqual([uid, uid2])
      expect(tree.nodes[0].nodes[1].nodes[0].path).toEqual([uid, uid2, uid3])
      expect(tree.nodes[0].nodes[1].nodes[1].path).toEqual([uid, uid2, uid4])
    })
  })

  describe('updateTreeNode', () => {

    it('root data', () => {

      const treeData = { nodes: [
        { node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] }, path: [uid], nodes: [] }
      ] }
      const path = [uid]
      const tree = updateTreeNode(treeData, path, { title: 'New title' })
      expect(tree.nodes.length).toBe(1)
      expect(tree.nodes[0].node.uid).toBe(uid)
      expect(tree.nodes[0].node.data).toEqual({ title: 'New title' })
    })

    it('1st generation data', () => {

      const treeData = {
        nodes: [{
          node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '1st child' }, ui: defaultUI, transactions: [] },
            path: [uid, uid1],
            nodes: []
          }]
        }]
      }
      const path = [uid, uid1]
      const tree = updateTreeNode(treeData, path, { title: 'New title' })
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].node.uid).toBe(uid1)
      expect(tree.nodes[0].nodes[0].node.data).toEqual({ title: 'New title' })
    })

    it('1st generation ui', () => {

      const treeData = {
        nodes: [{
          node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '1st child' }, ui: defaultUI, transactions: [] },
            path: [uid, uid1],
            nodes: []
          }]
        }]
      }
      const path = [uid, uid1]
      const ui = { ...defaultUI, editing: true }
      const tree = updateTreeNode(treeData, path, undefined, ui)
      expect(tree.nodes[0].nodes.length).toBe(1)
      expect(tree.nodes[0].nodes[0].node.ui).toEqual(ui)
    })
  })

  describe('removeTreeNode', () => {

    it('root', () => {
      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: '' }, ui: defaultUI, transactions: [] },
        path: [uid],
        nodes: []
      }] }
      const path = [uid]
      const tree = removeTreeNode(treeData, path)
      expect(tree.nodes.length).toBe(0)
    })

    it('1st generation', () => {

      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: '' }, ui: defaultUI, transactions: [] },
        path: [uid],
        nodes: [{
          node: { uid: uid1, user: null, data: { title: '' }, ui: defaultUI, transactions: [] },
          path: [uid, uid1],
          nodes: []
        }]
      }] }
      const path = [uid, uid1]
      const tree = removeTreeNode(treeData, path)
      expect(tree.nodes[0].nodes.length).toBe(0)
    })
  })

  describe('updateTreeNodes', () => {

    it('data', () => {

      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: defaultUI, transactions: [] },
        path: [uid],
        nodes: [{
          node: { uid: uid1, user: null, data: { title: 'Mr. Foo jr.' }, ui: defaultUI, transactions: [] },
          path: [uid, uid1],
          nodes: []
        }, {
          node: { uid: uid2, user: null, data: { title: 'Mr. Foo jr. 2' }, ui: defaultUI, transactions: [] },
          path: [uid, uid2],
          nodes: []
        }]
      }] }
      const data = { title: 'New title' }
      const tree = updateTreeNodes(treeData, data)
      expect(tree.nodes[0].node.data).toEqual(data)
      expect(tree.nodes[0].nodes[0].node.data).toEqual(data)
      expect(tree.nodes[0].nodes[1].node.data).toEqual(data)
    })

    it('ui', () => {

      const uiEditing = { ...defaultUI, editing: true }
      const treeData = {
        nodes: [{
          node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: uiEditing, transactions: [] },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '' }, ui: uiEditing, transactions: [] },
            path: [uid, uid1],
            nodes: []
          }, {
            node: { uid: uid2, user: null, data: { title: '' }, ui: uiEditing, transactions: [] },
            path: [uid, uid2],
            nodes: []
          }] }
        ]
      }
      const uiNonEditing = { ...defaultUI, editing: false }
      const tree = updateTreeNodes(treeData, undefined, uiNonEditing)
      expect(tree.nodes[0].node.ui).toEqual(uiNonEditing)
      expect(tree.nodes[0].nodes[0].node.ui).toEqual(uiNonEditing)
      expect(tree.nodes[0].nodes[1].node.ui).toEqual(uiNonEditing)
    })

    it('immutable', () => {

      const uiEditing = { ...defaultUI, editing: true }
      const treeData = { nodes: [{
        node: { uid, user: null, data: { title: 'Mr. Foo' }, ui: uiEditing, transactions: [] },
        path: [uid],
        nodes: [{
          node: { uid: uid1, user: null, data: { title: '' }, ui: uiEditing, transactions: [] },
          path: [uid, uid1],
          nodes: []
        }, {
          node: { uid: uid2, user: null, data: { title: '' }, ui: uiEditing, transactions: [] },
          path: [uid, uid2],
          nodes: []
        } ] }
      ] }
      const uiNonEditing = { ...defaultUI, editing: false }
      updateTreeNodes(treeData, undefined, uiNonEditing)
      expect(treeData.nodes[0].node.ui).toEqual(uiEditing)
      expect(treeData.nodes[0].nodes[0].node.ui).toEqual(uiEditing)
      expect(treeData.nodes[0].nodes[1].node.ui).toEqual(uiEditing)
    })
  })
})
