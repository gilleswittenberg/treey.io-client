import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node'
import NodeAdd from '../components/NodeAdd'

export default class Nodes extends React.Component {

  render () {

    const {
      parent,
      nodes = [],
      ui,
      setIsEditing,
      unsetIsEditing,
      postNode,
      putNode,
      deleteNode
    } = this.props
    const hasNodeAdd = parent !== null

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ index }>
            <Node
              postNode={ postNode }
              putNode={ putNode }
              deleteNode={ deleteNode }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              isEditing={ ui.isEditing === node._id }
              parent={ parent }
              id={ node._id }
              title={ node.title }
              nodes={ node.nodes }
              ui={ ui }
            />
          </li>
        ) }

        { hasNodeAdd &&
          <li>
            <NodeAdd
              postNode={ postNode }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              parent={ parent }
              isEditing={ ui.isEditing === parent + '.add' }
            />
          </li>
        }

      </ul>
    )
  }
}

export default compose(
  connect((state, props) => ({
    parent: props.parent,
    nodes: props.nodes,
    ui: props.ui,
    setIsEditing: props.setIsEditing,
    unsetIsEditing: props.unsetIsEditing,
    postNode: props.postNode,
    putNode: props.putNode,
    deleteNode: props.deleteNode
  }))
)(Nodes)
