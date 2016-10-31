/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import isURL from '../lib/isURL'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import { hasButtonsShown as hasButtonsShownFunc } from '../reducers/ui'

export default class NodeBody extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    lang: PropTypes.string,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  @autobind
  handleClick (event: Event) {

    // alt key to edit
    if (event.altKey) {
      this.startEditing()
    }
    // regular click to collapse or expand
    else {
      const { unsetIsEditing, toggleExpanded, uid  } = this.props
      unsetIsEditing()
      // guard
      if (!this.canExpand()) {
        return
      }
      toggleExpanded(uid)
    }
  }

  @autobind
  handleClickAdd () {
    this.startEditing('add')
  }

  @autobind
  handleClickEdit () {
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

  render () {

    const {
      lang,
      isRoot,
      title,
      hasNodes
    } = this.props

    const showAddButton = !hasNodes
    const showDeleteButton = !isRoot
    const hasButtonsShown = this.hasButtonsShown()

    const className = classNames(
      'node-body',
      { '-has-buttons-shown': hasButtonsShown }
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

    const contentIsURL = isURL(title)

    return (
      <div className={ className }>
        <div className={ nodeButtonsClassName }>
          { showAddButton &&
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClickAdd } />
          }
          <ButtonIcon type="EDIT" lang={ lang } handleClick={ this.handleClickEdit } />
          { showDeleteButton &&
            <ButtonIcon type="DELETE" lang={ lang } handleClick={ this.handleClickDelete } />
          }
        </div>
        <div className="node-content" onClick={ this.handleClick }>
          <ButtonIcon type="MORE" lang={ lang } handleClick={ this.handleClickShowButtons } />
          { contentIsURL && <span><a href={ title }>{ title }</a></span> }
          { !contentIsURL && <span>{ title }</span> }
        </div>
      </div>
    )
  }
}
