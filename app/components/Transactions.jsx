/* @flow */

import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'
import setTransactionsEffective from '../lib/node/setTransactionsEffective'
import classNames from 'classnames'

export default class Transactions extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired
  }

  render () {
    const { lang, transactions } = this.props
    const transactionsIsEmpty = transactions.length === 0
    const transactionsEffective = setTransactionsEffective(transactions)
    const transactionsReversed = transactionsEffective.reverse()
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
            { transactionsReversed.map(transaction => {
              const className =  classNames({
                '-non-effective': transaction.effective === false,
                '-is-denied': transaction.status === 'DENIED'
              })
              return (
                <tr key={ transaction.uuid } className={ className }>
                  <td>{ transaction.uuid }</td>
                  <td>{ transaction.node }</td>
                  <td>{ transaction.type }</td>
                  <td>{ transaction.status }</td>
                  <td>{ transaction.modified ? transaction.modified.toString() : '-' }</td>
                  <td>{ transaction.created ? transaction.created.toString() : '-' }</td>
                </tr>
              )}
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
