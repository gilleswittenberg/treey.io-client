/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import isURL from '../lib/isURL'
import __ from '../lib/i18n'

export class NodeBody extends Component {

  static propTypes = {
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

  constructor (props: any) {

    super(props)

    // @LINK: https://github.com/facebook/flow/issues/1517
    const self = (this: any)
    self.handleClick = this.handleClick.bind(this)
    self.handleClickAdd = this.handleClickAdd.bind(this)
    self.handleClickEdit = this.handleClickEdit.bind(this)
    self.handleClickDelete = this.handleClickDelete.bind(this)
    self.handleClickShowButtons = this.handleClickShowButtons.bind(this)
    self.startEditing = this.startEditing.bind(this)
  }

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

  handleClickAdd () {
    this.startEditing('add')
  }

  handleClickEdit () {
    this.startEditing()
  }

  startEditing (type?: string) {
    const { uid, setIsEditing } = this.props
    setIsEditing(uid, type)
  }

  handleClickDelete () {
    const { parent, uid, deleteNode } = this.props
    // guard
    if (!parent) {
      return
    }
    deleteNode(parent, uid)
  }

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
            <button onClick={ this.handleClickAdd } title={ __(lang, 'ADD') }>
              <i className="fa fa-plus-square-o"></i>
            </button>
          }
          <button onClick={ this.handleClickEdit } title={ __(lang, 'EDIT') }>
            <i className="fa fa-pencil-square-o"></i>
          </button>
          { showDeleteButton &&
            <button onClick={ this.handleClickDelete } title={ __(lang, 'DELETE') }>
              <i className="fa fa-trash-o"></i>
            </button>
          }
        </div>
        { /* this should be Draggable */ }
        <div className="node-content" onClick={ this.handleClick }>
          <button className="node-button-show-buttons" onClick={ this.handleClickShowButtons } title={ __(lang, 'MORE') }>
            <i className="fa fa-ellipsis-v"></i>
          </button>
          { contentIsURL && <span><a href={ title }>{ title }</a></span> }
          { !contentIsURL && <span>{ title }</span> }
        </div>
      </div>
    )
  }
}

export default connect()(NodeBody)