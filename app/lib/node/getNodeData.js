/* @flow */

import type { Transactions, NodeData } from '../../../flow/tree'

export default (transactions: Transactions) : ?NodeData => {
  const setTransactions = transactions.filter(transaction => transaction.type === 'SET')
  if (setTransactions.length === 0) {
    return null
  }
  const l = setTransactions.length
  return setTransactions[l - 1].data
}
