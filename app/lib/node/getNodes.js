/* @flow */

import type { Transactions, NodeId } from '../../../flow/tree'

export default (transactions: Transactions) : NodeId[] => {
  const nodes = []
  const childTransactions = transactions.filter(transaction => transaction.type === 'ADD_CHILD' || transaction.type === 'REMOVE_CHILD')
  const appliedTransactions = childTransactions.filter(transaction => transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  const revertTransactions = transactions.filter(transaction => transaction.type === 'REVERT' && transaction.status !== 'DENIED' && transaction.status !== 'CANCELLED')
  const nonRevertedRevertTransactions = revertTransactions.filter(transaction => revertTransactions.find(t => t.transaction === transaction.uuid) === undefined)
  appliedTransactions.forEach(transaction => {

    const isReverted = nonRevertedRevertTransactions.find(t => t.transaction === transaction.uuid) !== undefined

    switch (transaction.type) {
    case 'ADD_CHILD': {
      const before = transaction.before
      const child = transaction.child
      // Guard
      if (child == null) break
      const node = {
        uuid: child,
        isReverted
      }
      const index = before != null ? nodes.findIndex(n => n.uuid === before) : -1
      if (index > -1) {
        nodes.splice(index, 0, node)
      } else {
        nodes.push(node)
      }
      break
    }
    case 'REMOVE_CHILD': {
      // Guard isReverted
      if (isReverted) break
      const child = transaction.child
      // Guard non existing child
      if (child == null) break
      const index = nodes.findIndex(n => n.uuid === child)
      if (index > -1) {
        nodes.splice(index, 1)
      }
      break
    }
    }
  })
  return nodes.filter(n => n.isReverted === false).map(n => n.uuid)
}
