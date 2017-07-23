/* @flow */

import type { Transactions, NodeId } from '../../../flow/tree'

export default (transactions: Transactions) : NodeId[] => {
  const nodes = []
  const childTransactions = transactions.filter(transaction => transaction.type === 'ADD_CHILD' || transaction.type === 'REMOVE_CHILD')
  const appliedTransactions = childTransactions.filter(transaction => transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  appliedTransactions.forEach(transaction => {
    switch (transaction.type) {
    case 'ADD_CHILD': {
      const before = transaction.before
      const child = transaction.child
      // Guard
      if (child == null) { break }
      const index = before != null ? nodes.findIndex(node => node === transaction.before) : -1
      if (index > -1) {
        nodes.splice(index, 0, child)
      } else {
        nodes.push(child)
      }
      break
    }
    case 'REMOVE_CHILD': {
      const child = transaction.child
      // Guard
      if (child == null) { break }
      const index = nodes.findIndex(node => node === child)
      if (index > -1) {
        nodes.splice(index, 1)
      }
      break
    }
    }
  })
  return nodes
}
