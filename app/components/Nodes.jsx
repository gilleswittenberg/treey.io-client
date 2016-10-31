/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from '../components/NodeWrap'
import NodeAdd from '../components/NodeAdd'
import { defaultState, isEditing } from '../reducers/ui'
import { defaultActions } from '../lib/actions'

export default class Nodes extends Component {

  static propTypes = {
    // state
    ui: React.PropTypes.object,
    // props
    actions: PropTypes.object,
    parent: PropTypes.string,
    nodes: PropTypes.array
  }

  static defaultProps = {
    ui: defaultState,
    actions: defaultActions,
    parent: null,
    nodes: []
  }

  isRoot () : bool {
    return this.props.parent === null
  }

  // @TODO: What if parent == null
  isAdding () : bool {
    const { ui, parent } = this.props
    return isEditing(ui, parent, 'add')
  }

  render () {

    const {
      ui,
      ui: { lang },
      actions,
      actions: {
        setIsEditing,
        unsetIsEditing,
        expand,
        postNode
      },
      parent,
      nodes
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = this.isAdding()

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              ui={ ui }
              actions={ actions }
              parent={ parent }
              isRoot={ isRoot }
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
            <NodeAdd
              lang={ lang }
              parent={ parent }
              isEditing={ isAdding }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              expand={ expand }
              postNode={ postNode }
            />
          </li>
        }

      </ul>
    )
  }
}
