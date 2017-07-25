/* @flow */

import type { Transactions } from '../../../flow/tree'

export default (transactions: Transactions) : Transactions => {
  let transactionsIsOverridden
  transactionsIsOverridden = setCREATE(transactions)
  transactionsIsOverridden = setSET(transactionsIsOverridden)
  transactionsIsOverridden = setCHILDREN(transactionsIsOverridden)
  return transactionsIsOverridden
}

const setCREATE = (transactions: Transactions) : Transactions => {
  return transactions.map((transaction, index) => {
    if (transaction.type === 'CREATE') {
      transaction.isOverridden = index !== 0
    }
    return transaction
  })
}

const setSET = (transactions: Transactions) : Transactions => {
  let lastSetFound = false
  return transactions.reverse().map(transaction => {
    if (transaction.type === 'SET') {
      if (lastSetFound === false) {
        lastSetFound = true
        transaction.isOverridden = false
      } else {
        transaction.isOverridden = true
      }
    }
    return transaction
  }).reverse()
}

const setCHILDREN = (transactions: Transactions) : Transactions => {
  const removed = []
  return transactions.reverse().map(transaction => {
    if (transaction.type === 'REMOVE_CHILD') {
      transaction.isOverridden = true
      removed.push(transaction.node)
    }
    if (transaction.type === 'ADD_CHILD') {
      const index = removed.findIndex(elem => elem === transaction.node)
      if (index > -1) {
        transaction.isOverridden = true
        removed.splice(index, 1)
      } else {
        transaction.isOverridden = false
      }
    }
    return transaction
  }).reverse()
}
