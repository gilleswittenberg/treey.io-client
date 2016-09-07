import React from 'react'
import { connect } from 'react-redux'
import Node from '../components/Node'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'

class Nodes extends React.Component {

  static propTypes = {
    parent: React.PropTypes.string,
    nodes: React.PropTypes.array.isRequired,
    ui: React.PropTypes.object.isRequired,
    setIsEditing: React.PropTypes.func.isRequired,
    unsetIsEditing: React.PropTypes.func.isRequired,
    postNode: React.PropTypes.func.isRequired,
    putNode: React.PropTypes.func.isRequired,
    deleteNode: React.PropTypes.func.isRequired
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
