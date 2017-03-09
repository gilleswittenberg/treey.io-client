/* @flow */

import type { UUID, Node, NodeId, NodeUser, NodeData, NodeUI, Transaction, TransactionStatus } from '../../../flow/tree'

import { fromJS } from 'immutable'
import defaultUI from '../ui/defaultUI'

export const createNode = (id?: NodeId, user?: NodeUser, data?: NodeData, ui?: NodeUI, transactions?: Transaction[]) : Node => {
  const uid = id != null ? id : null
  const userValue = user || null
  const dataValue = data || { title: '' }
  const uiValue = ui || defaultUI
  const transactionsValue = transactions || []
  return {
    uid,
    user: userValue,
    data: dataValue,
    ui: uiValue,
    transactions: transactionsValue
  }
}

export const updateNode = (node: Node, id?: NodeId, data?: NodeData, ui?: NodeUI) : Node => {
  let nodeMap = fromJS(node)
  if (id != null) nodeMap = nodeMap.set('uid', id)
  if (data != null) nodeMap = nodeMap.mergeIn(['data'], fromJS(data))
  if (ui != null) nodeMap = nodeMap.mergeIn(['ui'], fromJS(ui))
  return nodeMap.toJS()
}

export const addTransaction = (node: Node, transaction: Transaction) : Node => {
  let nodeMap = fromJS(node)
  nodeMap = nodeMap.updateIn(['transactions'], list => list.push(transaction))
  // @TODO: extract update data from transactions, calculate state from transactions
  if (transaction.type === 'SET') {
    nodeMap = nodeMap.setIn(['data'], transaction.data)
  }
  return nodeMap.toJS()
}

export const updateTransactionStatus = (node: Node, uuid: UUID, status: TransactionStatus) : Node => {
  let nodeMap = fromJS(node)
  let entry = nodeMap.getIn(['transactions']).findEntry(value => value.get('uuid') === uuid)
  if (entry) {
    nodeMap = nodeMap.updateIn(['transactions', entry[0], 'status'], () => status)
  }
  return nodeMap.toJS()
}

export const parseNode = (obj: { uid?: NodeId, user?: string, data?: NodeData, transactions?: Transaction[] }) : Node => {
  const id = obj.uid != null ? obj.uid : undefined
  return createNode(id, obj.user, obj.data, undefined, obj.transactions)
}
