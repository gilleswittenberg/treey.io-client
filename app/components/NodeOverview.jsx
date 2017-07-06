/* @flow */

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Transactions from './Transactions'
import __ from '../lib/utils/i18n'

export default class NodeOverview extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired
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
      }
    } = this.props
    const user = auth ? auth.user : '-'
    const dataKeys = Object.keys(data)
    const transactionsProps = { lang, transactions }
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
        <ul>
        { nodes.map(node =>
          <li key={ node }><Link to={ '/node/' + node }>{ node }</Link></li>
        )}
        </ul>
        <Transactions { ...transactionsProps } />
      </div>
    )
  }
}
