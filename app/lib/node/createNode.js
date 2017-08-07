/* @flow */
import type { NodeId, Transaction } from '../../../flow/tree'

export default (uuid: NodeId, transaction: Transaction) => (
  { uuid, transactions: [transaction], nodes: [] }
)
