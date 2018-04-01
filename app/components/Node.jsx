/* @flow */

import type { Lang, UIState, NodesActionsInterface, UIActionsInterface } from '../../flow/types'
import type { NodeId, NodeData, TreePath, Nodes } from '../../flow/tree'

import autobind from 'autobind-decorator'
import React, { Component } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import ButtonMoveChild from './ButtonMoveChild'
import NodeDraggable from './NodeDraggable'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import arraysEqual from '../lib/utils/arraysEqual'
import { getPrevActive } from '../lib/tree/getNextPrevActive'
import { getNodeFromTreePath, getParentFromTreePath } from '../lib/tree/TreeUtils'

type Props = {
  lang: Lang,
  enableDnD: boolean,
  parent: ?NodeId,
  isRoot: boolean,
  uuid: NodeId,
  treePath: TreePath,
  data: NodeData,
  ui: UIState,
  hasNodes: boolean,
  nodesArray: Nodes,
  isOver: boolean,
}
& NodesActionsInterface
& UIActionsInterface

export default class Node extends Component<Props> {

  static defaultProps = {
    lang: DEFAULT_LANG,
    enableDnD: false,
    isOver: false
  }

  listeners = []

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  @autobind
  handleClick (event: Event) {

    event.stopPropagation()

    const { clearUIEditingAdding, setUIEditing, setUIExpanded, setUIActive, treePath } = this.props
    const isExpanded = this.isExpanded()

    if (event.altKey) {
      // Alt key to edit
      setUIEditing(treePath)
    } else {
      // Regular click to collapse or expand
      clearUIEditingAdding()
      if (isExpanded) {
        this.collapse()
      } else if (this.canExpand()) {
        setUIExpanded(treePath)
      }
    }

    setUIActive(treePath)
  }

  @autobind
  handleClickAdd (event: Event) {
    event.stopPropagation()
    const { treePath, setUIAdding } = this.props
    setUIAdding(treePath)
  }

  @autobind
  handleClickEdit (event: Event) {
    event.stopPropagation()
    const { treePath, setUIEditing } = this.props
    setUIEditing(treePath)
  }

  @autobind
  handleClickDelete (event: Event) {
    event.stopPropagation()
    const { treePath } = this.props
    this.remove(treePath)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { treePath, setUIButtonsShown } = this.props
    setUIButtonsShown(treePath)
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const {
      treePath,
      setUIExpanded,
      setUIEditing,
      setUIAdding
    } = this.props

    // Guard
    const isActive = this.isUI('active')
    if (!isActive) return

    // Guard
    const isEditing = this.isUI('editing')
    const isAdding = this.isUI('adding')
    if (isEditing || isAdding) return

    switch (event.keyCode) {
    // Left arrow
    case 37:
      event.preventDefault()
      this.collapse()
      break
    // Right arrow
    case 39:
      event.preventDefault()
      setUIExpanded(treePath)
      break
    // Enter
    case 13:
      event.preventDefault()
      setUIEditing(treePath)
      break
    // D
    case 68:
      if (event.shiftKey) {
        this.remove(treePath)
      }
      break
    // +
    case 187:
      event.preventDefault()
      setUIAdding(treePath)
      break
    default:
      break
    }
  }

  @autobind
  remove (treePath: TreePath) {
    const { isRoot, remove, setUIActive, nodesArray, ui: { active, expanded } } = this.props
    // Guard
    if (isRoot === true) return
    const parentId = getParentFromTreePath(treePath)
    const nodeId = getNodeFromTreePath(treePath)
    remove(parentId, nodeId)
    // Guard
    // @TODO: move active == null check into getPrevActive
    if (active == null) return
    //setUIActive(getPrevActive(nodesArray, active, expanded))
    const treePathParent = treePath.slice(0, -1)
    setUIActive(treePathParent)
  }

  @autobind
  collapse () {
    const { treePath, ui: { expanded }, unsetUIExpanded, isRoot } = this.props
    if (isRoot) return
    const index = expanded.findIndex(expandedTreePath => arraysEqual(expandedTreePath, treePath))
    if (index > -1) {
      unsetUIExpanded(index)
    }
  }

  canExpand () : bool {
    return this.props.hasNodes
  }

  isExpanded () : bool {
    const { treePath, ui: { expanded } } = this.props
    let isExpanded = false
    Object.keys(expanded).forEach(key => {
      if (arraysEqual(expanded[key], treePath)) {
        isExpanded = true
      }
    })
    return isExpanded
  }

  isUI (key: string) : bool {
    const { ui, treePath } = this.props
    if (ui && ui[key]) {
      if (arraysEqual(ui[key], treePath)) {
        return true
      }
    }
    return false
  }

  userIsDragging () : bool {
    const { ui } = this.props
    if (ui && ui.dragging != null) {
      return true
    }
    return false
  }

  render () {

    const {
      enableDnD,
      lang,
      isRoot,
      hasNodes
    } = this.props

    const showAddButton = !hasNodes
    const showDeleteButton = !isRoot
    const hasButtonsShown = this.isUI('buttonsShown')
    const isDragging = this.isUI('dragging')
    const showMoveChildButton = this.userIsDragging() && !hasNodes

    const className = classNames(
      'node-body',
      {
        '-has-move-child-button-shown': showMoveChildButton,
        '-has-buttons-shown': hasButtonsShown,
        '-is-dragging': isDragging
      }
    )

    let numButtons = 1
    if (showAddButton) numButtons += 1
    if (showDeleteButton) numButtons += 1
    const nodeButtonsClassName = classNames(
      'node-buttons',
      'node-buttons-default-hidden',
      {
        'node-buttons-num-2': numButtons === 2,
        'node-buttons-num-3': numButtons === 3
      }
    )

    // $FlowIssue Flow does not recognize ButtonMoveChild.DecoratedComponent
    const ButtonMoveChildComponent = enableDnD ? ButtonMoveChild : ButtonMoveChild.DecoratedComponent
    const buttonMoveChildProps = { ...this.props }

    // $FlowIssue Flow does not recognize NodeDraggable.DecoratedComponent
    const NodeDraggableComponent = enableDnD ? NodeDraggable : NodeDraggable.DecoratedComponent
    const nodeDraggableProps = {
      ...this.props,
      handleClick: this.handleClick,
      handleClickMore: this.handleClickShowButtons
    }

    return (
      <div className={ className }>
        <ButtonMoveChildComponent { ...buttonMoveChildProps } />
        <div className={ nodeButtonsClassName }>
          { showAddButton &&
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClickAdd } />
          }
          <ButtonIcon type="EDIT" lang={ lang } handleClick={ this.handleClickEdit } />
          { showDeleteButton &&
            <ButtonIcon type="DELETE" lang={ lang } handleClick={ this.handleClickDelete } />
          }
        </div>
        <NodeDraggableComponent { ... nodeDraggableProps } />
      </div>
    )
  }
}
