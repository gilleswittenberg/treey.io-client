/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Transactions from './Transactions'
import __ from '../lib/utils/i18n'

export default class NodeOverview extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    syncTransaction: PropTypes.func.isRequired,
    cancelTransaction: PropTypes.func.isRequired,
    revertTransaction: PropTypes.func.isRequired
  }

  render () {
    const {
      lang,
      node: {
        uuid,
        auth,
        data,
        nodes = [],
        transactions = []
      },
      syncTransaction,
      cancelTransaction,
      revertTransaction
    } = this.props
    const user = auth ? auth.user : '-'
    const dataKeys = Object.keys(data)
    const transactionsProps = { lang, transactions, showNode: false, syncTransaction, cancelTransaction, revertTransaction }
    const hasNodes = nodes.length > 0
    return (
      <div>
        <h1>{ __(lang, 'UUID') }</h1>
        <p>{ uuid }</p>
        <h1>{ __(lang, 'USER') }</h1>
        <p>{ user }</p>
        <h1>{ __(lang, 'DATA') }</h1>
        <ul>
          { dataKeys.map(key =>
            <li key={ key }>{ key }: { data[key] }</li>
          ) }
        </ul>
        <h1>{ __(lang, 'NODES') }</h1>
        { !hasNodes &&
          <p>-</p>
        }
        { hasNodes &&
          <ul>
            { nodes.map(node =>
              <li key={ node }><Link to={ `/node/${ node }` }>{ node }</Link></li>
            )}
          </ul>
        }
        <Transactions { ...transactionsProps } />
      </div>
    )
  }
}
