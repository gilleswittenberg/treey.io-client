/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import NavBack from '../components/NavBack'
import Transactions from '../components/Transactions'

class Session extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app: { lang },
      nodes: { nodes }
    } = this.props

    const actions = getActions(dispatch)

    const navBackProps = { lang }
    const transactions = nodes.reduce((prev, node) => prev.concat(node.transactions), [])
    const transactionsFiltered = transactions.filter(transaction => transaction.created != null)
    const transactionsSorted = transactionsFiltered.sort((a, b) => new Date(a.created) - new Date(b.created))
    const transactionsProps = { lang, transactions: transactionsSorted, ...actions }

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
