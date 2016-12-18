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

    clearUIEditingAdding: PropTypes.func.isRequired,
    clearUIButtonsShown: PropTypes.func.isRequired,
    setUIEditing: PropTypes.func.isRequired,
    setUIAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired,
    setUIButtonsShown: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
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

    const { clearUIEditingAdding, setUIEditing, setUIExpanded, setUIActive, ui: { expanded }, path } = this.props

    // alt key to edit
    if (event.altKey) {
      setUIEditing(path)
    }
    // regular click to collapse or expand
    else {
      clearUIEditingAdding()
      if (this.canExpand()) {
        setUIExpanded(path, !expanded)
      }
    }

    setUIActive(path)
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
    const { path, deleteNode } = this.props
    deleteNode(path)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { path, clearUIButtonsShown, setUIButtonsShown } = this.props
    clearUIButtonsShown()
    setUIButtonsShown(path)
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const { ui: { active, editing, adding }, path, setUIExpanded, setUIEditing, setUIAdding, deleteNode } = this.props

    // guard
    if (active !== true || editing === true || adding === true) { return }

    switch (event.keyCode) {
    case 37: // left arrow
      event.preventDefault()
      setUIExpanded(path, false)
      break
    case 39: // right arrow
      event.preventDefault()
      setUIExpanded(path)
      break
    case 13: // enter
      event.preventDefault()
      setUIEditing(path)
      break
    case 68: // d
      if (event.shiftKey) {
        deleteNode(path)
      }
      break
    case 187: // +
      event.preventDefault()
      setUIAdding(path)
      break
    }
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
