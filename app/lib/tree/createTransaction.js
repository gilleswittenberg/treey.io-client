import type { Transaction, TransactionType, NodeData } from '../../../flow/tree'
import uuid from 'uuid/v4'

export default (type: TransactionType, nodeData: NodeData) : ?Transaction => {

  const transaction = {
    uuid: uuid(),
    status: 'PENDING'
  }

  switch (type) {
  case 'SET':
    transaction.type = 'SET'
    transaction.data = nodeData
    return transaction
  default:
    return null
  }
}
