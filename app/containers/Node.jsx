/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NavBack from '../components/NavBack'
import NodeOverview from '../components/NodeOverview'

class Node extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired
  }

  render () {

    const {
      app: { lang },
      nodes: { nodes },
      params: { uuid }
    } = this.props

    const navBackProps = { lang }
    const node = nodes.find(node => node.uuid === uuid)
    const nodeOverviewProps = { lang, node }

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
