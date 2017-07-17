import type { NodeId, Transaction } from '../../../flow/tree'

export default (uuid: NodeId, transaction: Transaction) => {
  return { uuid, transactions: [transaction], nodes: [] }
}
