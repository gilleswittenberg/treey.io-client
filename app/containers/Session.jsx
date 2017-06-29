/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Transactions from '../components/Transactions'
import { Link } from 'react-router'
import __ from '../lib/utils/i18n'

class Session extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired
  }

  render () {

    const {
      app: { lang },
      nodes: { nodes }
    } = this.props

    const transactions = nodes.reduce((prev, node) => prev.concat(node.transactions), [])
    const transactionsFiltered = transactions.filter(transaction => transaction.created != null)
    const transactionsSorted = transactionsFiltered.sort((a, b) => new Date(b.created) - new Date(a.created))
    const props = { lang, transactions: transactionsSorted }

    return (
      <div>
        <div className="session-menu">
          <Link to="/">{ __(lang, 'BACK') }</Link>
        </div>
        <Transactions { ...props } />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(Session)
