/* @flow */

import type { Transactions } from '../../../flow/tree'

export default (transactions: Transactions) : Transactions => {
  let effectiveTransactions
  effectiveTransactions = setCREATE(transactions)
  effectiveTransactions = setSET(effectiveTransactions)
  effectiveTransactions = setCHILDREN(effectiveTransactions)
  effectiveTransactions = setREVERT(effectiveTransactions)
  return effectiveTransactions
}

const setCREATE = (transactions: Transactions) : Transactions => {
  return transactions.map((transaction, index) => {
    if (transaction.type === 'CREATE') {
      transaction.effective = index === 0
    }
    return transaction
  })
}

const setSET = (transactions: Transactions) : Transactions => {
  let firstSetFound = false
  return transactions.reverse().map(transaction => {
    if (transaction.type === 'SET') {
      if (firstSetFound === false) {
        firstSetFound = true
        transaction.effective = true
      } else {
        transaction.effective = false
      }
    }
    return transaction
  }).reverse()
}

const setCHILDREN = (transactions: Transactions) : Transactions => {
  const removed = []
  return transactions.reverse().map(transaction => {
    if (transaction.type === 'REMOVE_CHILD') {
      transaction.effective = false
      removed.push(transaction.node)
    }
    if (transaction.type === 'ADD_CHILD') {
      const index = removed.findIndex(elem => elem === transaction.node)
      if (index > -1) {
        transaction.effective = false
        removed.splice(index, 1)
      } else {
        transaction.effective = true
      }
    }
    return transaction
  }).reverse()
}

const setREVERT = (transactions: Transactions) : Transactions => {
  return transactions.map(transaction => {
    if (transaction.type === 'REVERT') {
      transaction.effective = false
    }
    return transaction
  })
}
