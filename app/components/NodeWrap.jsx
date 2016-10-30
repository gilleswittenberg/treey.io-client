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
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG,
    ui: {},
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
      actions,
      actions: { unsetIsEditing, putNode, deleteNode }
    } = this.props
    const isEditing = isEditingFunc(ui, uid)
    const isAdding = isEditingFunc(ui, uid, 'add')
    const isDragging = isDraggingFunc(ui, uid)
    const isExpanded = isExpandedFunc(ui, uid)
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
              parent={ parent }
              isRoot={ isRoot }
              uid={ uid }
              title={ title }
              hasNodes={ hasNodes }
              after={ after }
              showDeleteButton={ !isRoot }
              actions={ actions }
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
          actions={ actions }
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state,
  lang: state.ui ? state.ui.lang : undefined,
  ...props,
  isRoot: props.parent === null,
  hasNodes: Array.isArray(props.nodes) && props.nodes.length > 0
})
export default connect(mapStateToProps)(NodeWrap)
