/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import ButtonMoveChild from './ButtonMoveChild'
import NodeDraggable from './NodeDraggable'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import arraysEqual from '../lib/utils/arraysEqual'
import propTypeShapeUI from '../lib/ui/propTypeShapeUI'

export default class Node extends Component {

  static propTypes = {
    lang: PropTypes.string,
    enableDnD: PropTypes.bool,
    app: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uuid: PropTypes.string.isRequired,
    treePath: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    ui: PropTypes.shape(propTypeShapeUI),
    hasNodes: PropTypes.bool.isRequired,
    isOver: PropTypes.bool,
    setUIEditing: PropTypes.func.isRequired,
    setUIAdding: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired,
    setUIButtonsShown: PropTypes.func.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    unsetUIExpanded: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG,
    enableDnD: false,
    isOver: false
  }

  listeners = []

  @autobind
  handleClick (event: Event) {

    event.stopPropagation()

    const { clearUIEditingAdding, setUIEditing, setUIExpanded, unsetUIExpanded, setUIActive, treePath } = this.props
    const isExpanded = this.isExpanded()

    // Alt key to edit
    if (event.altKey) {
      setUIEditing(treePath)
    }
    // Regular click to collapse or expand
    else {
      clearUIEditingAdding()
      if (isExpanded) {
        unsetUIExpanded(treePath)
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
    const { treePath, remove } = this.props
    remove(treePath)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { treePath, setUIButtonsShown } = this.props
    setUIButtonsShown(treePath)
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const { treePath, setUIExpanded, unsetUIExpanded, setUIEditing, setUIAdding, remove } = this.props

    // Guard
    const isActive = this.isUI('active')
    if (!isActive) return

    // Guard
    const isEditing = this.isUI('editing')
    const isAdding = this.isUI('adding')
    if (isEditing || isAdding) return

    switch (event.keyCode) {
    case 37: // Left arrow
      event.preventDefault()
      unsetUIExpanded(treePath)
      break
    case 39: // Right arrow
      event.preventDefault()
      setUIExpanded(treePath)
      break
    case 13: // Enter
      event.preventDefault()
      setUIEditing(treePath)
      break
    case 68: // D
      if (event.shiftKey) {
        remove(treePath)
      }
      break
    case 187: // +
      event.preventDefault()
      setUIAdding(treePath)
      break
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
        '-has-move-child-button-shown':  showMoveChildButton,
        '-has-buttons-shown': hasButtonsShown,
        '-is-dragging': isDragging
      }
    )

    let numButtons = 1
    if (showAddButton) numButtons++
    if (showDeleteButton) numButtons++
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
