import type { NodeId, Transaction } from '../../../flow/tree'

export default (uid: NodeId, transaction: Transaction) => {
  return { uid, transactions: [transaction], nodes: [] }
}
