/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import ButtonMoveChild from './ButtonMoveChild'
import NodeDraggable from './NodeDraggable'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import {
  hasButtonsShown as hasButtonsShownFunc,
  isDragging as isDraggingFunc
} from '../reducers/ui'

export default class Node extends Component {

  static propTypes = {
    lang: PropTypes.string,
    enableDnD: PropTypes.bool,
    ui: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    path: PropTypes.array.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    isOver: PropTypes.bool,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG,
    enableDnD: false,
    isOver: false
  }

  @autobind
  handleClick (event: Event) {

    event.stopPropagation()

    // alt key to edit
    if (event.altKey) {
      this.startEditing()
    }
    // regular click to collapse or expand
    else {
      const { unsetIsEditing, updateNodeUI, nodeUi: { expanded }, path } = this.props
      unsetIsEditing()
      // guard
      if (!this.canExpand()) {
        return
      }
      updateNodeUI(path, 'expanded', !expanded)
    }
  }

  @autobind
  handleClickAdd (event: Event) {
    event.stopPropagation()
    this.startEditing('add')
  }

  @autobind
  handleClickEdit (event: Event) {
    event.stopPropagation()
    this.startEditing()
  }

  @autobind
  startEditing (type?: string) {
    const { uid, setIsEditing } = this.props
    setIsEditing(uid, type)
  }

  @autobind
  handleClickDelete () {
    const { parent, uid, deleteNode } = this.props
    deleteNode(parent, uid)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { uid, setShowButtons } = this.props
    setShowButtons(uid)
  }

  canExpand () : bool {
    return this.props.hasNodes
  }

  hasButtonsShown () : bool {
    const { ui, uid } = this.props
    return hasButtonsShownFunc(ui, uid)
  }

  isDragging () : bool {
    const { ui, uid } = this.props
    return isDraggingFunc(ui, uid)
  }

  userIsDragging () : bool {
    const { ui: { dragging } } = this.props
    return dragging !== null
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
    const hasButtonsShown = this.hasButtonsShown()
    const isDragging = this.isDragging()
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
