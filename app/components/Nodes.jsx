/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from './NodeWrap'
import NodeAdd from './NodeAdd'
import NodeOver from './NodeOver'
// import propTypeShapeUI from '../lib/ui/propTypeShapeUI'

export default class Nodes extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    parent: PropTypes.string,
    // ui: PropTypes.shape(propTypeShapeUI),
    nodesArray: PropTypes.array,
    nodes: PropTypes.array,
    hasNodes: PropTypes.bool
  }

  static defaultProps = {
    enableDnD: false,
    parent: null,
    ui: {},
    nodes: [],
    hasNodes: false
  }

  isRoot () : bool {
    return this.props.parent === null
  }

  render () {

    const {
      nodesArray,
      nodes,
      hasNodes,
      // @TODO: check if this works
      ui: { adding, movingChild }
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot

    const showNodeMoveChild = !hasNodes && movingChild
    const showNodeAdd = hasNodeAdd && !movingChild

    const nodeWrapProps = { ...this.props, isRoot }
    const nodeAddProps = { ...this.props, isEditing: adding }
    const nodesPopulated = nodes.map(nodeId => nodesArray.find(node => node.uid === nodeId))

    return (
      <ul>

        { nodesPopulated.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              { ...nodeWrapProps }
              uid={ node.uid }
              path={ node.path }
              data={ node.data }
              ui={ node.ui }
              nodes={ node.nodes }
              siblings={ nodes }
              index={ index }
            />
          </li>
        ) }

        { showNodeAdd &&
          <li>
            <NodeAdd { ...nodeAddProps } />
          </li>
        }

        { showNodeMoveChild &&
          <li>
            <NodeOver position="child" />
          </li>
        }

      </ul>
    )
  }
}
