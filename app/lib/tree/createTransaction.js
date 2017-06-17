import type { Transaction, TransactionType, NodeData, NodeId } from '../../../flow/tree'
import uuidv4 from 'uuid/v4'

export default (type: TransactionType, uuid?: NodeId, nodeData?: NodeData, child?: NodeId, before?: NodeId) : ?Transaction => {

  const transaction = {
    uuid: uuidv4(),
    node: uuid,
    status: 'PENDING'
  }

  switch (type) {
  case 'CREATE':
    transaction.type = 'CREATE'
    transaction.node = uuidv4()
    return transaction
  case 'SET':
    transaction.type = 'SET'
    transaction.data = nodeData
    return transaction
  case 'REMOVE_CHILD':
    transaction.type = 'REMOVE_CHILD'
    transaction.child = child
    return transaction
  case 'ADD_CHILD':
    transaction.type = 'ADD_CHILD'
    transaction.child = child
    transaction.before = before
    return transaction
  default:
    return null
  }
}
