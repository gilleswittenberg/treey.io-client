/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NodeDroppable from '../components/NodeDroppable'
import NodeEdit from '../components/NodeEdit'
import Nodes from '../components/Nodes'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import {
  isEditing as isEditingFunc,
  isDragging as isDraggingFunc,
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
    lang: DEFAULT_LANG,
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
      setIsDragging,
      unsetIsDragging,
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
    const isDragging = isDraggingFunc(ui, uid)
    const isAdding = isEditingFunc(ui, uid, 'add')
    const hasButtonsShown = hasButtonsShownFunc(ui, uid)

    const className = classNames(
      'node',
      {
        '-is-dragging': isDragging,
        '-is-expanded': (isExpanded && hasNodes) || isAdding,
        '-has-buttons-shown': hasButtonsShown
      }
    )

    const showNodeDroppable = !isEditing
    const showNodeEdit = isEditing

    return (
      <div>
        <div className={ className }>
          { showNodeDroppable &&
            <NodeDroppable
              ui={ ui }
              parent={ parent }
              isRoot={ isRoot }
              uid={ uid }
              title={ title }
              hasNodes={ hasNodes }
              after={ after }
              showDeleteButton={ !isRoot }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              setIsDragging={ setIsDragging }
              unsetIsDragging={ unsetIsDragging }
              toggleExpanded={ toggleExpanded }
              deleteNode={ deleteNode }
              setShowButtons={ setShowButtons }
              putMoveNode={ putMoveNode }
            />
          }
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
          parent={ uid }
          nodes={ nodes }
          ui={ ui }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          setIsDragging={ setIsDragging }
          unsetIsDragging={ unsetIsDragging }
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
  lang: state.ui && state.ui.lang,
  isRoot: props.parent === null,
  hasNodes: Array.isArray(props.nodes) && props.nodes.length > 0
})
export default connect(mapStateToProps)(NodeWrap)
