/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import NavBack from '../components/NavBack'
import NodeOverview from '../components/NodeOverview'

class Node extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app: { lang },
      nodes: { nodes },
      params: { uuid }
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
