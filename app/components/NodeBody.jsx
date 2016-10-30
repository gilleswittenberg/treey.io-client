/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import isURL from '../lib/isURL'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeBody extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    showAddButton: PropTypes.bool.isRequired,
    showDeleteButton: PropTypes.bool.isRequired,
    allowExpanding: PropTypes.bool.isRequired,
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
      const { unsetIsEditing, allowExpanding, toggleExpanded, uid  } = this.props
      unsetIsEditing()
      // guard
      if (!allowExpanding) {
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
    // guard
    if (!parent) {
      return
    }
    deleteNode(parent, uid)
  }

  @autobind
  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { uid, setShowButtons } = this.props
    setShowButtons(uid)
  }

  render () {

    const {
      lang,
      title,
      showAddButton,
      showDeleteButton
    } = this.props

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

    // @TODO: extract to isURL method
    const contentIsURL = isURL(title)

    return (
      <div className="node-body">
        <div className={ nodeButtonsClassName }>
          { showAddButton &&
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClickAdd } />
          }
          <ButtonIcon type="EDIT" lang={ lang } handleClick={ this.handleClickEdit } />
          { showDeleteButton &&
            <ButtonIcon type="DELETE" lang={ lang } handleClick={ this.handleClickDelete } />
          }
        </div>
        { /* this should be Draggable */ }
        <div className="node-content" onClick={ this.handleClick }>
          <ButtonIcon type="MORE" lang={ lang } handleClick={ this.handleClickShowButtons } />
          { contentIsURL && <span><a href={ title }>{ title }</a></span> }
          { !contentIsURL && <span>{ title }</span> }
        </div>
      </div>
    )
  }
}
