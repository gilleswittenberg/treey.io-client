/* @flow */

import React, { Component, PropTypes } from 'react'
import ButtonIcon from './ButtonIcon'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

const DropSpec = {

  hover (props) {
    const { uid, setIsMovingChild } = props
    setIsMovingChild(uid)
  },

  drop (props, monitor) {
    const item = monitor.getItem() // NodeDraggable props
    const {
      parent: parentDraggable,
      uid: uidDraggable
    } = item
    const { uid, putMoveNode } = props // NodeDroppable props
    putMoveNode(parentDraggable, uidDraggable, uid)
  }
}

class ButtonMoveChild extends Component {

  static propTypes = {
    lang: PropTypes.string,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool
  }

  static defaultProps = {
    connectDropTarget: (jsx: any) => jsx
  }

  componentWillReceiveProps (nextProps: any) {
    const { isOver, unsetIsMovingChild } = this.props
    if (nextProps.isOver === false && isOver === true) {
      unsetIsMovingChild()
    }
  }

  render () {

    const {
      lang,
      isOver,
      connectDropTarget
    } = this.props

    const className = classNames(
      'node-button-move-child',
      {
        '-is-over': isOver
      }
    )

    return (
      connectDropTarget(
        <div className={ className }>
          <ButtonIcon type="MOVE_CHILD" lang={ lang } />
        </div>
      )
    )
  }
}

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class ButtonMoveChildDecorated extends ButtonMoveChild {}
