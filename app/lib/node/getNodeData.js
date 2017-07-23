/* @flow */

import type { Transactions, NodeData } from '../../../flow/tree'

export default (transactions: Transactions) : ?NodeData => {
  const setTransactions = transactions.filter(transaction => transaction.type === 'SET')
  const appliedTransactions = setTransactions.filter(transaction => transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  if (appliedTransactions.length === 0) {
    return null
  }
  const l = appliedTransactions.length
  return appliedTransactions[l - 1].data
}
