/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import ButtonMoveChild from './ButtonMoveChild'
import NodeDraggable from './NodeDraggable'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import propTypeShapeUI from '../lib/ui/propTypeShapeUI'

export default class Node extends Component {

  static propTypes = {
    lang: PropTypes.string,
    enableDnD: PropTypes.bool,
    app: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    path: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    ui: PropTypes.shape(propTypeShapeUI),
    hasNodes: PropTypes.bool.isRequired,
    isOver: PropTypes.bool,
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
    clearUIEditing: PropTypes.func.isRequired,
    setUIEditing: PropTypes.func.isRequired,
    setUIAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
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
      const { setUIEditing, path } = this.props
      setUIEditing(path)
    }
    // regular click to collapse or expand
    else {
      const { clearUIEditing, setUIExpanded, ui: { expanded }, path } = this.props
      clearUIEditing()
      // guard
      if (!this.canExpand()) { return }
      setUIExpanded(path, !expanded)
    }
  }

  @autobind
  handleClickAdd (event: Event) {
    event.stopPropagation()
    const { parent: { path }, setUIAdding } = this.props
    setUIAdding(path)
  }

  @autobind
  handleClickEdit (event: Event) {
    event.stopPropagation()
    const { path, setUIEditing } = this.props
    setUIEditing(path)
  }

  @autobind
  handleClickDelete () {
    // @TODO: remove parent, uid
    const { path, parent, uid, deleteNode } = this.props
    deleteNode(path, parent, uid)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { path, clearNodeUI, updateNodeUI } = this.props
    clearNodeUI('buttonsShown')
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
      ui: {
        buttonsShown,
        dragging
      },
      userIsDragging
    } = this.props

    const showAddButton = !hasNodes
    const showDeleteButton = !isRoot
    const hasButtonsShown = buttonsShown
    const isDragging = dragging
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
