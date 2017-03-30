/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { createNode } from '../../../app/lib/tree/NodeModifiers'
import { updatePath, createTreeNode, updateTreeNode, addTreeNodeTransaction, updateTreeNodeTransactionStatus, parseTreeNode } from '../../../app/lib/tree/TreeNodeModifiers'
import { uid, uid1, uid2, uid3, uid4 } from '../../uid'
import defaultUI from '../../../app/lib/ui/defaultUI'
import createTransaction from '../../../app/lib/tree/createTransaction'

describe('TreeNodeModifiers', () => {

  describe('updatePath', () => {

    it('treeNode nodes deep', () => {
      const node = createNode(uid1)
      const treeNodesGrandChildren = [createTreeNode(createNode(uid4), [uid1, uid3])]
      const treeNodes = [createTreeNode(createNode(uid2), [uid1]), createTreeNode(createNode(uid3), [uid1], treeNodesGrandChildren)]
      const treeNode = createTreeNode(node, [uid], treeNodes)
      const updatedTreeNode = updatePath(treeNode, [uid])
      expect(updatedTreeNode.path).toEqual([uid, uid1])
      expect(updatedTreeNode.nodes[0].path).toEqual([uid, uid1, uid2])
      expect(updatedTreeNode.nodes[1].path).toEqual([uid, uid1, uid3])
      expect(updatedTreeNode.nodes[1].nodes[0].path).toEqual([uid, uid1, uid3, uid4])
    })
  })

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

  describe('addTreeNodeTransaction', () => {

    describe('SET', () => {

      it('transactions, data', () => {
        const data = { title: 'Mr. Foo' }
        const transaction0 = { type: 'SET', uid, data, status: 'COMMITTED', uuid: '' }
        const node = createNode(undefined, undefined, data, undefined, [transaction0])
        const treeNode = createTreeNode(node)
        const transaction1 = { type: 'SET', uid, data: { title: 'New title' }, status: 'PENDING', uuid: '' }
        const updatedTreeNode = addTreeNodeTransaction(treeNode, transaction1)
        expect(updatedTreeNode.node.data).toEqual({ title: 'New title' })
        expect(updatedTreeNode.node.transactions).toEqual([transaction0, transaction1])
      })
    })

    describe('REMOVE_CHILD', () => {

      it('transactions, nodes', () => {
        const childNode = createNode(uid, undefined, { title: 'Child' }, undefined)
        const childTreeNode = createTreeNode(childNode)
        const data = { title: 'Mr. Foo' }
        const transaction0 = { type: 'SET', uid, data, status: 'COMMITTED', uuid: '' }
        const node = createNode(undefined, undefined, data, undefined, [transaction0])
        const treeNode = createTreeNode(node, undefined, [childTreeNode])
        const transaction1 = { type: 'REMOVE_CHILD', uid, status: 'PENDING', uuid: '' }
        const updatedTreeNode = addTreeNodeTransaction(treeNode, transaction1)
        expect(updatedTreeNode.node.transactions).toEqual([transaction0, transaction1])
        expect(updatedTreeNode.nodes).toEqual([])
      })
    })

    describe('ADD_CHILD', () => {

      it('transactions, nodes', () => {
        const data = { title: 'Mr. Foo' }
        const transaction0 = { type: 'SET', uid, data, status: 'COMMITTED', uuid: '' }
        const node = createNode(undefined, undefined, data, undefined, [transaction0])
        const treeNode = createTreeNode(node)
        const transaction1 = { type: 'ADD_CHILD', uid, childUid: uid1, status: 'PENDING', uuid: '' }
        const updatedTreeNode = addTreeNodeTransaction(treeNode, transaction1)
        expect(updatedTreeNode.node.transactions).toEqual([transaction0, transaction1])
        expect(updatedTreeNode.nodes).toEqual([uid1])
      })

      it('transactions, nodes, before', () => {
        const childNode = createNode(uid, undefined, { title: 'Child' }, undefined)
        const childTreeNode = createTreeNode(childNode)
        const data = { title: 'Mr. Foo' }
        const transaction0 = { type: 'SET', uid, data, status: 'COMMITTED', uuid: '' }
        const node = createNode(undefined, undefined, data, undefined, [transaction0])
        const treeNode = createTreeNode(node, undefined, [childTreeNode])
        const transaction1 = { type: 'ADD_CHILD', uid, childUid: uid2, before: uid, status: 'PENDING', uuid: '' }
        const updatedTreeNode = addTreeNodeTransaction(treeNode, transaction1)
        expect(updatedTreeNode.node.transactions).toEqual([transaction0, transaction1])
        expect(updatedTreeNode.nodes).toEqual([uid2, childTreeNode])
      })
    })
  })

  describe('updateTreeNodeTransactionStatus', () => {

    it('transaction status', () => {
      const data = { title: 'Mr. Foo' }
      const transaction = createTransaction('SET', data)
      const node = createNode(undefined, undefined, data, undefined, [transaction])
      const treeNode = createTreeNode(node)
      const updatedTreeNode = updateTreeNodeTransactionStatus(treeNode, transaction.uuid, 'COMMITTED')
      expect(updatedTreeNode.node.transactions[0].status).toBe('COMMITTED')
    })
  })

  describe('parseTreeNode', () => {

    it('node', () => {
      const nodeData = { uid, data: { title: 'Mr. Foo' } }
      const treeNode = parseTreeNode(nodeData)
      expect(treeNode.path).toEqual([uid])
      expect(treeNode.nodes).toEqual([])
      expect(treeNode.node.uid).toBe(uid)
      expect(treeNode.node.data.title).toBe('Mr. Foo')
    })

    it('nodes', () => {
      const nodeData = { uid, data: { title: 'Mr. Foo' }, nodes: [
        { uid: uid1, data: { title: 'First child' } },
        { uid: uid2, data: { title: 'Second child' } }
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
