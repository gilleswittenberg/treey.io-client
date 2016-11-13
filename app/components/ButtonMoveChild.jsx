/* @flow */

import React, { Component, PropTypes } from 'react'
import ButtonIcon from './ButtonIcon'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

const DropSpec = {

  hover (props) {
    const { path, updateNodeUI } = props
    updateNodeUI(path, 'movingChild', true)
  },

  drop (props, monitor) {
    const item = monitor.getItem() // NodeDraggable props
    const {
      parent: parentDraggable,
      uid: uidDraggable
    } = item
    const { uid, path, putMoveNode, updateNodeUI } = props // NodeDroppable props
    putMoveNode(parentDraggable, uidDraggable, uid)
    updateNodeUI(path, 'expanded', true)
  }
}

class ButtonMoveChild extends Component {

  static propTypes = {
    lang: PropTypes.string,
    updateNodeUI: PropTypes.func.isRequired,
    clearNodeUI: PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool
  }

  static defaultProps = {
    connectDropTarget: (jsx: any) => jsx
  }

  // logic for hover out
  componentWillReceiveProps (nextProps: any) {
    const { isOver, clearNodeUI } = this.props
    if (nextProps.isOver === false && isOver === true) {
      clearNodeUI('movingChild')
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
  isOver: monitor.isOver({ shallow: true })
}))
export default class ButtonMoveChildDecorated extends ButtonMoveChild {}
