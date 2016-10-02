import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Node from '../components/Node'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'

class Nodes extends Component {

  static propTypes = {
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    nodes: PropTypes.array.isRequired,
    ui: PropTypes.object.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  }

  render () {

    const {
      parent,
      isRoot,
      nodes = [],
      ui,
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      toggleExpanded,
      expand,
      postNode,
      putNode,
      deleteNode,
      moveNode
    } = this.props
    const hasNodeAdd = !isRoot

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node._id }>
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
              setShowButtons={ setShowButtons }
              toggleExpanded={ toggleExpanded }
              expand={ expand }
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
              expand={ expand }
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
  isRoot: props.parent === null,
  nodes: props.nodes,
  ui: props.ui,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  toggleExpanded: props.toggleExpanded,
  expand: props.expand,
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  moveNode: props.moveNode
}))(Nodes)
