/* @flow */

import type { Transactions } from '../../../flow/tree'

export default (transactions: Transactions) : Transactions => {
  const revertTransactions = transactions.filter(transaction => transaction.type === 'REVERT')
  return transactions.map(transaction => {
    const revertTransaction = revertTransactions.find(t => t.transaction === transaction.uuid)
    transaction.isReverted = revertTransaction !== undefined
    return transaction
  })
}
