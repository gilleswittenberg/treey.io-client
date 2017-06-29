/* @flow */

import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'

export default class Transactions extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired
  }

  render () {
    const { lang, transactions } = this.props
    const transactionsIsEmpty = transactions.length === 0
    return (
      <div className="transactions">
        <h1>{ __(lang, 'TRANSACTIONS') }</h1>
        { !transactionsIsEmpty &&
          <table>
            <thead>
              <tr>
                <th>{ __(lang, 'UUID') }</th>
                <th>{ __(lang, 'NODE') }</th>
                <th>{ __(lang, 'TYPE') }</th>
                <th>{ __(lang, 'STATUS') }</th>
                <th>{ __(lang, 'MODIFIED') }</th>
                <th>{ __(lang, 'CREATED') }</th>
              </tr>
            </thead>
            <tbody>
            { transactions.map(transaction =>
              <tr key={ transaction.uuid }>
                <td>{ transaction.uuid }</td>
                <td>{ transaction.node }</td>
                <td>{ transaction.type }</td>
                <td>{ transaction.status }</td>
                <td>{ transaction.modified ? transaction.modified.toString() : '-' }</td>
                <td>{ transaction.created ? transaction.created.toString() : '-' }</td>
              </tr>
            ) }
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
