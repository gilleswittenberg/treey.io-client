/* @flow */

import React, { Component } from 'react'
import __ from '../lib/utils/i18n'
import setTransactionsIsOverridden from '../lib/node/setTransactionsIsOverridden'
import TransactionRow from './TransactionRow'
import type { Lang } from '../../flow/types'
import type { Transaction } from '../../flow/tree'

type Props = {
  lang: Lang,
  transactions: Transaction[],
  syncTransaction: (transaction: Transaction) => {},
  cancelTransaction: (transaction: Transaction) => {},
  revertTransaction: (transaction: Transaction) => {},
  showNode: boolean
}

export default class Transactions extends Component<Props> {

  static defaultProps = {
    showNode: true
  }

  render () {

    const { lang, transactions, showNode, syncTransaction, cancelTransaction, revertTransaction } = this.props
    const transactionsIsEmpty = transactions.length === 0
    const transactionsIsOverridden = setTransactionsIsOverridden(transactions)
    const transactionsReversed = transactionsIsOverridden.reverse()

    return (
      <div className="transactions">
        <h1>{ __(lang, 'TRANSACTIONS') }</h1>
        { !transactionsIsEmpty &&
          <table>
            <thead>
              <tr>
                <th>{ __(lang, 'UUID') }</th>
                { showNode && <th>{ __(lang, 'NODE') }</th> }
                <th>{ __(lang, 'TYPE') }</th>
                <th>{ __(lang, 'STATUS') }</th>
                <th>{ __(lang, 'SYNCING') }</th>
                <th>{ __(lang, 'REVERTED') }</th>
                <th>{ __(lang, 'MODIFIED') }</th>
                <th>{ __(lang, 'CREATED') }</th>
                <th>{ __(lang, 'ACTIONS') }</th>
              </tr>
            </thead>
            <tbody>
              { transactionsReversed.map(transaction => {
                const transactionRowProps = { lang, transaction, showNode, syncTransaction, cancelTransaction, revertTransaction }
                return <TransactionRow key={ transaction.uuid } { ...transactionRowProps }></TransactionRow>
              }) }
            </tbody>
          </table>
        }
        { transactionsIsEmpty &&
          <p>{ __(lang, 'TRANSACTIONS_EMPTY') }</p>
        }
      </div>
    )
  }
}
