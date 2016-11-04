/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from '../components/NodeWrap'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'

export default class Nodes extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    parent: PropTypes.string,
    nodes: PropTypes.array
  }

  static defaultProps = {
    enableDnD: false,
    parent: null,
    nodes: []
  }

  isRoot () : bool {
    return this.props.parent === null
  }

  isAdding () : bool {
    const { ui, parent } = this.props
    return isEditing(ui, parent, 'add')
  }

  render () {

    const {
      nodes
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = this.isAdding()

    const nodeWrapProps = { ...this.props, isRoot }
    const nodeAddProps = { ...this.props, isEditing: isAdding }

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              { ...nodeWrapProps }
              uid={ node.uid }
              title={ node.title }
              nodes={ node.nodes }
              siblings={ nodes }
              index={ index }
            />
          </li>
        ) }

        { hasNodeAdd &&
          <li>
            <NodeAdd { ...nodeAddProps } />
          </li>
        }

      </ul>
    )
  }
}
