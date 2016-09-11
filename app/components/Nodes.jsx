import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Node from '../components/Node'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'

class Nodes extends Component {

  static propTypes = {
    parent: PropTypes.string,
    nodes: PropTypes.array.isRequired,
    ui: PropTypes.object.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  }

  render () {

    const {
      parent,
      nodes = [],
      ui,
      setIsEditing,
      unsetIsEditing,
      postNode,
      putNode,
      deleteNode,
      moveNode
    } = this.props
    const hasNodeAdd = parent !== null

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ index }>
            <Node
              parent={ parent }
              id={ node._id }
              after={ nodes[index + 1] ? nodes[index + 1]._id : null }
              title={ node.title }
              nodes={ node.nodes }
              ui={ ui }
              isEditing={ isEditing(ui, node._id) }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              postNode={ postNode }
              putNode={ putNode }
              deleteNode={ deleteNode }
              moveNode={ moveNode }
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
              isEditing={ isEditing(ui, parent, 'add') }
            />
          </li>
        }

      </ul>
    )
  }
}

export default connect((state, props) => ({
  parent: props.parent,
  nodes: props.nodes,
  ui: props.ui,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  moveNode: props.moveNode
}))(Nodes)
