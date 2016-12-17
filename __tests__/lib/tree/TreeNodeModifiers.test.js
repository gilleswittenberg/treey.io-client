/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { createNode } from '../../../app/lib/tree/NodeModifiers'
import { createTreeNode, updateTreeNode, parseTreeNode } from '../../../app/lib/tree/TreeNodeModifiers'
import { uid, uid1, uid2 } from '../../uid'
import defaultUI from '../../../app/lib/ui/defaultUI'

describe('TreeNodeModifiers', () => {

  describe('createTreeNode', () => {

    it('node', () => {
      const node = createNode(uid)
      const treeNode = createTreeNode(node)
      expect(treeNode.node).toEqual(node)
      expect(treeNode.path).toEqual([uid])
      expect(treeNode.nodes).toEqual([])
    })

    it('path', () => {
      const node = createNode(uid2)
      const treeNode = createTreeNode(node, [uid, uid1])
      expect(treeNode.node).toEqual(node)
      expect(treeNode.path).toEqual([uid, uid1, uid2])
      expect(treeNode.nodes).toEqual([])
    })

    it('nodes', () => {
      const childNode = createNode(uid1)
      const childTreeNode = createTreeNode(childNode, [uid])
      const node = createNode(uid)
      const treeNode = createTreeNode(node, [], [childTreeNode])
      expect(treeNode.node).toEqual(node)
      expect(treeNode.nodes).toEqual([childTreeNode])
    })
  })

  describe('TreeNodeModifiers', () => {

    describe('updateTreeNode', () => {

      it('id, data, ui, immutable', () => {
        const node = createNode(uid)
        const treeNode = createTreeNode(node)
        const ui = { ...defaultUI, editing: true }
        const updatedTreeNode = updateTreeNode(treeNode, uid1, { title: 'New title' }, ui)
        expect(updatedTreeNode.node.uid).toEqual(uid1)
        expect(updatedTreeNode.node.data).toEqual({ title: 'New title' })
        expect(updatedTreeNode.node.ui).toEqual(ui)
        expect(node.uid).toEqual(uid)
        expect(node.data).toEqual({ title: '' })
        expect(node.ui).toEqual(defaultUI)
      })

      it('id, path', () => {
        const node = createNode()
        const treeNode = createTreeNode(node)
        const updatedTreeNode = updateTreeNode(treeNode, uid)
        expect(updatedTreeNode.node.uid).toBe(uid)
        expect(updatedTreeNode.path).toEqual([uid])
      })
    })
  })

  describe('parseTreeNode', () => {

    it('node', () => {
      const nodeData = { uid, title: 'Mr. Foo' }
      const treeNode = parseTreeNode(nodeData)
      expect(treeNode.path).toEqual([uid])
      expect(treeNode.nodes).toEqual([])
      expect(treeNode.node.uid).toBe(uid)
      expect(treeNode.node.data.title).toBe('Mr. Foo')
    })

    it('nodes', () => {
      const nodeData = { uid, title: 'Mr. Foo', nodes: [
        { uid: uid1, title: 'First child' },
        { uid: uid2, title: 'Second child' }
      ] }
      const treeNode = parseTreeNode(nodeData)
      expect(treeNode.nodes.length).toEqual(2)
      expect(treeNode.nodes[0].path).toEqual([uid, uid1])
      expect(treeNode.nodes[0].node.data.title).toBe('First child')
      expect(treeNode.nodes[1].path).toEqual([uid, uid2])
      expect(treeNode.nodes[1].node.data.title).toBe('Second child')
    })
  })
})
