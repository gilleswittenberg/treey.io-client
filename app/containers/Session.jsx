/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NavBack from '../components/NavBack'
import Transactions from '../components/Transactions'

class Session extends React.Component {

  static propTypes = {
    app: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired
  }

  render () {

    const {
      app: { lang },
      nodes: { nodes }
    } = this.props

    const navBackProps = { lang }
    const transactions = nodes.reduce((prev, node) => prev.concat(node.transactions), [])
    const transactionsFiltered = transactions.filter(transaction => transaction.created != null)
    const transactionsSorted = transactionsFiltered.sort((a, b) => new Date(b.created) - new Date(a.created))
    const transactionsProps = { lang, transactions: transactionsSorted }

    return (
      <div className="wrap">
        <NavBack { ...navBackProps } />
        <Transactions { ...transactionsProps } />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(Session)
