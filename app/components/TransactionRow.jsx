/* @flow */

import type { Lang, TransactionsActionsInterface } from '../../flow/types'
import type { Transaction } from '../../flow/tree'

import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import __ from '../lib/utils/i18n'
import classNames from 'classnames'

type Props = {
  lang: Lang,
  transaction: Transaction,
  showNode: boolean
}
& TransactionsActionsInterface

export default class TransactionRow extends Component<Props> {

  @autobind
  handleSubmitSync () {
    const { syncTransaction, transaction } = this.props
    return syncTransaction(transaction)
  }

  @autobind
  handleSubmitCancel () {
    const { cancelTransaction, transaction } = this.props
    return cancelTransaction(transaction)
  }

  @autobind
  handleSubmitRevert () {
    const { revertTransaction, transaction } = this.props
    return revertTransaction(transaction)
  }

  render () {

    const { lang, transaction, showNode } = this.props
    const className = classNames({
      '-is-denied': transaction.status === 'DENIED',
      '-is-overridden': transaction.isOverridden === true,
      '-is-revert': transaction.type === 'REVERT',
      '-is-non-effective': transaction.status === 'CANCELLED' || transaction.isReverted
    })
    const showSyncButton = transaction.isSyncing === false && transaction.status === 'PENDING'
    const showCancelButton = showSyncButton
    const showRevertButton = transaction.status === 'COMMITTED' && transaction.isReverted !== true
    const handleSubmitSync = this.handleSubmitSync // eslint-disable-line no-sync

    return (
      <tr className={ className }>
        <td>{ transaction.uuid }</td>
        { showNode && <td>{ transaction.node }</td> }
        <td>{ transaction.type }</td>
        <td>{ transaction.status }</td>
        <td>{ transaction.isSyncing ? __(lang, 'TRUE') : '-' }</td>
        <td>{ transaction.isReverted ? __(lang, 'TRUE') : '-' }</td>
        <td>{ transaction.modified ? transaction.modified.toString() : '-' }</td>
        <td>{ transaction.created ? transaction.created.toString() : '-' }</td>
        <td>
          { showSyncButton && <button onClick={ handleSubmitSync }>{ __(lang, 'SYNC') }</button> }
          { showCancelButton && <button onClick={ this.handleSubmitCancel }>{ __(lang, 'CANCEL') }</button> }
          { showRevertButton && <button onClick={ this.handleSubmitRevert }>{ __(lang, 'REVERT') }</button> }
        </td>
      </tr>
    )
  }
}
