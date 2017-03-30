import type { Transaction, TransactionType, NodeData, NodeId } from '../../../flow/tree'
import uuid from 'uuid/v4'
import createMongoObjectId from './createMongoObjectId'

export default (type: TransactionType, uid?: NodeId, nodeData?: NodeData, childUid?: NodeId, before?: NodeId) : ?Transaction => {

  const transaction = {
    uid,
    uuid: uuid(),
    status: 'PENDING'
  }

  switch (type) {
  case 'CREATE':
    transaction.type = 'CREATE'
    transaction.uid = createMongoObjectId()
    return transaction
  case 'SET':
    transaction.type = 'SET'
    transaction.data = nodeData
    return transaction
  case 'REMOVE_CHILD':
    transaction.type = 'REMOVE_CHILD'
    transaction.childUid = childUid
    return transaction
  case 'ADD_CHILD':
    transaction.type = 'ADD_CHILD'
    transaction.childUid = childUid
    transaction.before = before
    return transaction
  default:
    return null
  }
}
