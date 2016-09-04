import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node'
import NodeAdd from '../components/NodeAdd'

export default class Nodes extends React.Component {

  render () {

    const { dispatch, nodes = [], ui, parent } = this.props
    const hasNodeAdd = parent !== null

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ index }>
            <Node dispatch={ dispatch } parent={ parent } id={ node._id } title={ node.title } nodes={ node.nodes } ui={ ui } />
          </li>
        ) }

        { hasNodeAdd &&
          <li>
            <NodeAdd parent={ parent } dispatch={ dispatch } ui={ ui } />
          </li>
        }

      </ul>
    )
  }
}

export default compose(
  connect((state, props) => ({
    dispatch: props.dispatch,
    nodes: props.nodes,
    ui: props.ui,
    parent: props.parent
  }))
)(Nodes)
