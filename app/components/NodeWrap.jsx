/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NodeDroppable from '../components/NodeDroppable'
import NodeEdit from '../components/NodeEdit'
import Nodes from '../components/Nodes'
import {
  isEditing as isEditingFunc,
  hasButtonsShown as hasButtonsShownFunc,
  isExpanded as isExpandedFunc
} from '../reducers/ui'

export class NodeWrap extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    after: PropTypes.string,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
    hasNodes: PropTypes.bool.isRequired,
    ui: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    putMoveNode: PropTypes.func.isRequired
  }

  static defaultProps = {
    nodes: [],
    title: ''
  }

  state = {
    isOverPosition: -1
  }

  element = undefined

  render () {

    const {
      lang,
      parent,
      isRoot,
      uid,
      title,
      nodes,
      hasNodes,
      after,
      ui,
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      expand,
      toggleExpanded,
      isEditing,
      postNode,
      putNode,
      deleteNode,
      putMoveNode
    } = this.props
    const isExpanded = isExpandedFunc(ui, uid)
    const isAdding = isEditingFunc(ui, uid, 'add')
    const hasButtonsShown = hasButtonsShownFunc(ui, uid)

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': (isExpanded && hasNodes) || isAdding,
        '-has-buttons-shown': hasButtonsShown
      }
    )

    const showNodeEdit = isEditing

    return (
      <div>
        <div className={ className }>
          <NodeDroppable
            lang={ lang }
            parent={ parent }
            isRoot={ isRoot }
            uid={ uid }
            title={ title }
            hasNodes={ hasNodes }
            after={ after }
            showDeleteButton={ !isRoot }
            isEditing={ isEditing }
            unsetIsEditing={ unsetIsEditing }
            setIsEditing={ setIsEditing }
            toggleExpanded={ toggleExpanded }
            deleteNode={ deleteNode }
            setShowButtons={ setShowButtons }
            putMoveNode={ putMoveNode }
          />
          { showNodeEdit &&
            <NodeEdit
              lang={ lang }
              parent={ parent }
              uid={ uid }
              title={ title }
              unsetIsEditing={ unsetIsEditing }
              putNode={ putNode }
              deleteNode={ deleteNode }
            />
          }
        </div>

        <Nodes
          lang={ lang }
          parent={ uid }
          nodes={ nodes }
          ui={ ui }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          setShowButtons={ setShowButtons }
          expand={ expand }
          toggleExpanded={ toggleExpanded }
          deleteNode={ deleteNode }
          postNode={ postNode }
          putNode={ putNode }
          putMoveNode={ putMoveNode }
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...props,
  isRoot: props.parent === null,
  hasNodes: Array.isArray(props.nodes) && props.nodes.length > 0
})
export default connect(mapStateToProps)(NodeWrap)
