/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import NavBack from '../components/NavBack'
import NodeOverview from '../components/NodeOverview'

type Props = {
  dispatch: Dispatch,
  match: any
}
& State


class Node extends Component<Props> {

  render () {

    const {
      dispatch,
      app: { lang },
      nodes: { nodes },
      match: { params: { uuid } }
    } = this.props

    const actions = getActions(dispatch)

    const navBackProps = { lang }
    const node = nodes.find(n => n.uuid === uuid)
    const nodeOverviewProps = { lang, node, ...actions }

    return (
      <div className="wrap">
        <NavBack { ...navBackProps } />
        { node && <NodeOverview { ...nodeOverviewProps } /> }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(Node)
