/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { createNode, updateNode, addTransaction, updateTransactionStatus, parseNode } from '../../../app/lib/tree/NodeModifiers'
import createTransaction from '../../../app/lib/tree/createTransaction'
import defaultUI from '../../../app/lib/ui/defaultUI'
import { uid, uid1 } from '../../uid'

describe('NodeModifiers', () => {

  describe('createNode', () => {

    it('undefined arguments', () => {
      const node = createNode()
      expect(node.uid).toBe(null)
      expect(node.user).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('undefined arguments', () => {
      const node = createNode(undefined, undefined, undefined)
      expect(node.uid).toBe(null)
      expect(node.user).toBe(null)
      expect(node.data).toEqual({ title: '' })
      expect(node.ui).toEqual(defaultUI)
    })

    it('uid', () => {
      const node = createNode(uid)
      expect(node.uid).toBe(uid)
    })

    it('user', () => {
      const node = createNode(undefined, 'johndoe')
      expect(node.user).toBe('johndoe')
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, undefined, data)
      expect(node.data).toEqual(data)
    })

    it('ui', () => {
      const ui = { ...defaultUI, editing: true }
      const node = createNode(undefined, undefined, undefined, ui)
      expect(node.ui).toEqual(ui)
    })

    it('transactions', () => {
      const transactions = [
        { type: 'SET', uid, data: { title: 'Mr. First' }, status: 'PENDING', uuid: '' },
        { type: 'SET', uid, data: { title: 'Mr. Foo' }, status: 'PENDING', uuid: '' }
      ]
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, undefined, data, undefined, transactions)
      expect(node.data).toEqual(data)
      expect(node.transactions).toEqual(transactions)
    })
  })

  describe('updateNode', () => {

    it('id', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, undefined, data)
      const node2 = updateNode(node, uid)
      expect(node2.uid).toBe(uid)
      expect(node2.data).toEqual({ title: 'Mr. Foo' })
      expect(node2.ui).toEqual(defaultUI)
    })

    it('data', () => {
      const data = { title: 'Mr. Foo' }
      const node = createNode(undefined, undefined, data)
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

  describe('addTransaction', () => {

    describe('SET', () => {

      it('transaction', () => {
        const data = { title: 'Mr. Foo' }
        const transactions = [{ type: 'SET', uid, data, status: 'PENDING', uuid: '' }]
        const node = createNode(undefined, undefined, data, undefined, transactions)
        const transaction = { type: 'SET', uid, data: { title: 'New title' }, status: 'PENDING', uuid: '' }
        const node2 = addTransaction(node, transaction)
        expect(node2.transactions.length).toEqual(2)
        expect(node2.transactions[1]).toEqual(transaction)
        expect(node2.data).toEqual({ title: 'New title' })
      })
    })

    describe('REMOVE_CHILD', () => {

      it('transaction', () => {
        const data= { title: 'Title' }
        const transactions = [{ type: 'SET', uid, data, status: 'PENDING', uuid: '' }]
        const node = createNode(undefined, undefined, data, undefined, transactions)
        const transaction = { type: 'REMOVE_CHILD', uid, status: 'PENDING', uuid: '' }
        const node2 = addTransaction(node, transaction)
        expect(node2.transactions.length).toEqual(2)
        expect(node2.transactions[1]).toEqual(transaction)
        expect(node2.data).toEqual(data)
      })
    })
  })

  describe('updateTransactionStatus', () => {

    it('COMMITTED', () => {
      const data = { title: 'Mr. Foo' }
      const transaction = createTransaction('SET', data)
      const transactions = [transaction]
      const node = createNode(undefined, undefined, data, undefined, transactions)
      const node2 = updateTransactionStatus(node, transaction.uuid, 'COMMITTED')
      expect(node2.transactions.length).toEqual(1)
      expect(node2.transactions[0].status).toEqual('COMMITTED')
      expect(node2.data).toEqual(data)
    })
  })

  describe('parseNode', () => {

    it('node', () => {
      const nodeData = { title: 'Mr. Foo' }
      const transaction = { type: 'SET', uid, status: 'COMMITTED', data: nodeData, uuid: '' }
      const data = {
        uid,
        data: nodeData,
        transactions: [transaction]
      }
      const node = parseNode(data)
      expect(node.uid).toBe(uid)
      expect(node.data).toEqual({ title: 'Mr. Foo' })
      expect(node.ui).toEqual(defaultUI)
      expect(node.transactions).toEqual([transaction])
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
