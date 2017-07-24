/* @flow */

import type { Transactions, NodeData } from '../../../flow/tree'

export default (transactions: Transactions) : ?NodeData => {
  const setTransactions = transactions.filter(transaction => transaction.type === 'SET' && transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  const revertTransactions = transactions.filter(transaction => transaction.type === 'REVERT' && transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  const nonRevertedSetTransactions = setTransactions.filter(transaction => revertTransactions.find(t => t.transaction === transaction.uuid) === undefined)
  if (nonRevertedSetTransactions.length === 0) {
    return null
  }
  const l = nonRevertedSetTransactions.length
  return nonRevertedSetTransactions[l - 1].data
}
