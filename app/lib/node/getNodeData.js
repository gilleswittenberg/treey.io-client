/* @flow */

import type { Transactions, NodeData } from '../../../flow/tree'

export default (transactions: Transactions) : ?NodeData => {
  const setTransactions = transactions.filter(transaction => transaction.type === 'SET')
  const nonDeniedTransactions = setTransactions.filter(transaction => transaction.status !== 'DENIED')
  if (nonDeniedTransactions.length === 0) {
    return null
  }
  const l = nonDeniedTransactions.length
  return nonDeniedTransactions[l - 1].data
}
