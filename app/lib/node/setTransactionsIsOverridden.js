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
  let createTransactionsFound = []
  return transactions.map(transaction => {
    const node = transaction.node
    if (transaction.type === 'CREATE') {
      if (!createTransactionsFound.includes(node)) {
        transaction.isOverridden = false
        createTransactionsFound.push(node)
      } else {
        transaction.isOverridden = true
      }
    }
    return transaction
  })
}

const setSET = (transactions: Transactions) : Transactions => {
  let setTransactionsFound = []
  // Need to clone transactions, because reverse method is mutable
  return [...transactions].reverse().map(transaction => {
    if (transaction.type === 'SET') {
      const node = transaction.node
      if (!setTransactionsFound.includes(node)) {
        setTransactionsFound.push(node)
        transaction.isOverridden = false
      } else {
        transaction.isOverridden = true
      }
    }
    return transaction
  }).reverse()
}

const setCHILDREN = (transactions: Transactions) : Transactions => {
  const removed = {}
  // Need to clone transactions, because reverse method is mutable
  return [...transactions].reverse().map(transaction => {
    const node = transaction.node
    if (transaction.type === 'REMOVE_CHILD') {
      transaction.isOverridden = true
      if (removed[node] === undefined) {
        removed[node] = []
      }
      removed[node].push(transaction.child)
    }
    if (transaction.type === 'ADD_CHILD') {
      let index = -1
      if (removed[node] !== undefined) {
        index = removed[node].findIndex(elem => elem === transaction.child)
      }
      if (index > -1) {
        transaction.isOverridden = true
        removed[node].splice(index, 1)
      } else {
        transaction.isOverridden = false
      }
    }
    return transaction
  }).reverse()
}
