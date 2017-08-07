/* @flow */

import type { Transaction, TransactionType, NodeData, NodeId, TransactionId } from '../../../flow/tree'
import uuidv4 from 'uuid/v4'

export default ( // eslint-disable-line max-params
  type: TransactionType,
  uuid?: NodeId,
  nodeData?: NodeData,
  child?: NodeId,
  before?: NodeId,
  revertTransaction?: TransactionId) : Transaction => {

  const date = new Date()

  const transaction: any = {
    uuid: uuidv4(),
    node: uuid,
    status: 'PENDING',
    modified: date,
    created: date
  }

  switch (type) {
  case 'CREATE':
    transaction.type = 'CREATE'
    transaction.node = uuidv4()
    break
  case 'SET':
    transaction.type = 'SET'
    transaction.data = nodeData
    break
  case 'REMOVE_CHILD':
    transaction.type = 'REMOVE_CHILD'
    transaction.child = child
    break
  case 'ADD_CHILD':
    transaction.type = 'ADD_CHILD'
    transaction.child = child
    transaction.before = before
    break
  case 'REVERT':
    transaction.type = 'REVERT'
    transaction.transaction = revertTransaction
    break
  default:
    break
  }

  return transaction
}
