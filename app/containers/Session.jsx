/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import NavBack from '../components/NavBack'
import Transactions from '../components/Transactions'

type Props = {
  dispatch: Dispatch,
}
& State

class Session extends Component<Props> {

  render () {

    const {
      dispatch,
      app: { lang },
      nodes: { nodes }
    } = this.props

    const actions = getActions(dispatch)

    const navBackProps = { lang }
    // Need to clone nodes, because reverse method is mutable
    const transactions = [...nodes].reverse().reduce((prev, node) => prev.concat(node.transactions), [])
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
