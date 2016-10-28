/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NodeWrap from '../components/NodeWrap'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'

export class Nodes extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    nodes: PropTypes.array.isRequired,
    ui: PropTypes.object.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  }

  render () {

    const {
      lang,
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
      putMoveNode
    } = this.props
    const hasNodeAdd = !isRoot

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              lang={ lang }
              parent={ parent }
              uid={ node.uid }
              after={ nodes[index + 1] ? nodes[index + 1].uid : null }
              title={ node.title }
              nodes={ node.nodes }
              ui={ ui }
              isEditing={ isEditing(ui, node.uid) }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              setShowButtons={ setShowButtons }
              toggleExpanded={ toggleExpanded }
              expand={ expand }
              postNode={ postNode }
              putNode={ putNode }
              deleteNode={ deleteNode }
              putMoveNode={ putMoveNode }
            />
          </li>
        ) }

        { hasNodeAdd &&
          <li>
            <NodeAdd
              lang={ lang }
              parent={ parent }
              isEditing={ isEditing(ui, parent, 'add') }
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

const mapStateToProps = (state, props) => ({
  ...props,
  isRoot: props.parent === null
})
export default connect(mapStateToProps)(Nodes)
