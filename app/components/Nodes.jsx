/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from './NodeWrap'
import NodeAdd from './NodeAdd'
import NodeOver from './NodeOver'
import arraysEqual from '../lib/utils/arraysEqual'
import propTypeShapeUI from '../lib/ui/propTypeShapeUI'

export default class Nodes extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    parent: PropTypes.string,
    treePath: PropTypes.array.isRequired,
    ui: PropTypes.shape(propTypeShapeUI),
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

  isUI (key: string) : bool {
    const { ui, treePath } = this.props
    if (ui && ui[key]) {
      if (arraysEqual(ui[key], treePath)) {
        return true
      }
    }
    return false
  }

  render () {

    const {
      nodesArray,
      nodes,
      hasNodes,
      treePath,
      ui
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = this.isUI('adding')
    const isMovingChild = this.isUI('movingChild')

    const showNodeMoveChild = !hasNodes && isMovingChild
    const showNodeAdd = hasNodeAdd && !isMovingChild

    const nodeWrapProps = { ...this.props, isRoot }
    const nodeAddProps = { ...this.props, isEditing: isAdding }
    // @TODO: Display non findable nodes in UI
    const nodesPopulated = nodes.map(nodeId => nodesArray.find(node => node.uuid === nodeId)).filter(node => node != null)

    return (
      <ul>

        { nodesPopulated.map((node, index) =>
          <li key={ node.uuid }>
            <NodeWrap
              { ...nodeWrapProps }
              uuid={ node.uuid }
              data={ node.data }
              ui={ ui }
              nodes={ node.nodes }
              siblings={ nodes }
              index={ index }
              treePath={ treePath.concat([node.uuid]) }
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
