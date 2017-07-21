/* @flow */

import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import __ from '../lib/utils/i18n'
import classNames from 'classnames'

export default class TransactionRow extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    transaction: PropTypes.object.isRequired,
    syncTransaction: PropTypes.func.isRequired,
    showNode: PropTypes.bool.isRequired
  }

  @autobind
  handleSubmitSync () {
    const { syncTransaction, transaction } = this.props
    return syncTransaction(transaction)
  }

  render () {

    const { lang, transaction, showNode } = this.props
    const className =  classNames({
      '-non-effective': transaction.effective === false,
      '-is-denied': transaction.status === 'DENIED'
    })
    const showSyncButton = transaction.isSyncing === false && transaction.status === 'PENDING'

    return (
      <tr className={ className }>
        <td>{ transaction.uuid }</td>
        { showNode && <td>{ transaction.node }</td> }
        <td>{ transaction.type }</td>
        <td>{ transaction.status }</td>
        <td>{ transaction.isSyncing ? '&hellip;' : '-' }</td>
        <td>{ transaction.modified ? transaction.modified.toString() : '-' }</td>
        <td>{ transaction.created ? transaction.created.toString() : '-' }</td>
        <td>{ showSyncButton && <button onClick={ this.handleSubmitSync }>{ __(lang, 'SYNC') }</button> }</td>
      </tr>
    )
  }
}
