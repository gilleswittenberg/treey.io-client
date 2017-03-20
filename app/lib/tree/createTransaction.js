import type { Transaction, TransactionType, NodeData, NodeId } from '../../../flow/tree'
import uuid from 'uuid/v4'

export default (type: TransactionType, nodeData?: NodeData, uid?: NodeId) : ?Transaction => {

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
  default:
    return null
  }
}
