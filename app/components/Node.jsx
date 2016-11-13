/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import ButtonMoveChild from './ButtonMoveChild'
import NodeDraggable from './NodeDraggable'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

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
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
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
      const { updateNodeUi, path } = this.props
      updateNodeUi(path, 'editing', true)
    }
    // regular click to collapse or expand
    else {
      const { clearNodeUI, updateNodeUI, nodeUi: { expanded }, path } = this.props
      // @TODO: combine
      clearNodeUI('adding')
      clearNodeUI('editing')
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
    const { parent: { path }, updateNodeUI } = this.props
    updateNodeUI(path, 'adding', true)
  }

  @autobind
  handleClickEdit (event: Event) {
    event.stopPropagation()
    const { path, updateNodeUI } = this.props
    updateNodeUI(path, 'editing', true)
  }

  @autobind
  handleClickDelete () {
    const { parent, uid, deleteNode } = this.props
    deleteNode(parent, uid)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { path, clearNodeUI, updateNodeUI } = this.props
    clearNodeUI('showButtons')
    updateNodeUI(path)
  }

  canExpand () : bool {
    return this.props.hasNodes
  }

  render () {

    const {
      enableDnD,
      lang,
      isRoot,
      hasNodes,
      nodeUi,
      userIsDragging
    } = this.props

    const showAddButton = !hasNodes
    const showDeleteButton = !isRoot
    const hasButtonsShown = nodeUi && nodeUi.showButtons === true
    const isDragging = nodeUi && nodeUi.dragging === true
    const showMoveChildButton = userIsDragging && !hasNodes

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
