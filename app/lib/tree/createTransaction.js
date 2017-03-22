import type { Transaction, TransactionType, NodeData, NodeId } from '../../../flow/tree'
import uuid from 'uuid/v4'

export default (type: TransactionType, nodeData?: NodeData, uid?: NodeId, before?: NodeId) : ?Transaction => {

  const transaction = {
    uuid: uuid(),
    status: 'PENDING'
  }

  switch (type) {
  case 'SET':
    transaction.type = 'SET'
    transaction.data = nodeData
    return transaction
  case 'REMOVE_CHILD':
    transaction.type = 'REMOVE_CHILD'
    transaction.uid = uid
    return transaction
  case 'ADD_CHILD':
    transaction.type = 'ADD_CHILD'
    transaction.uid = uid
    transaction.before = before
    return transaction
  default:
    return null
  }
}
