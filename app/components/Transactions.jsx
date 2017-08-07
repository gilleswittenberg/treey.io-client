/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import __ from '../lib/utils/i18n'
import setTransactionsIsOverridden from '../lib/node/setTransactionsIsOverridden'
import TransactionRow from './TransactionRow'

export default class Transactions extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    syncTransaction: PropTypes.func.isRequired,
    cancelTransaction: PropTypes.func.isRequired,
    showNode: PropTypes.bool
  }

  static defaultProps = {
    showNode: true
  }

  render () {

    const { lang, transactions, showNode, syncTransaction, cancelTransaction } = this.props
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
                const transactionRowProps = { lang, transaction, showNode, syncTransaction, cancelTransaction }
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
