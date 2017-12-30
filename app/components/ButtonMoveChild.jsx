/* @flow */

import type { Lang } from '../../flow/types'

import React, { Component } from 'react'
import ButtonIcon from './ButtonIcon'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

const DropSpec = {

  hover (props) {
    const { path, setUIMovingChild } = props
    setUIMovingChild(path)
  },

  drop (props, monitor) {
    // NodeDraggable
    const item = monitor.getItem()
    // NodeDraggable props
    const { path } = item
    // NodeDroppable props
    const { uuid: before, path: pathDroppable, putMoveNode, setUIExpanded } = props
    const newPath = pathDroppable && pathDroppable.length > 1 ? pathDroppable.slice(0, -1) : pathDroppable
    putMoveNode(path, newPath, before)
    setUIExpanded(path)
  }
}

type Props = {
  lang: Lang,
  setUIExpanded: any,
  setUIMovingChild: any,
  clearUIMovingChild: any,
  connectDropTarget: any,
  isOver: boolean
}

class ButtonMoveChild extends Component<Props> {

  static defaultProps = {
    isOver: false,
    connectDropTarget: (jsx: any) => jsx
  }

  // Logic for hover out
  componentWillReceiveProps (nextProps: any) {
    const { isOver, clearUIMovingChild } = this.props
    if (nextProps.isOver === false && isOver === true) {
      clearUIMovingChild()
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
      { '-is-over': isOver }
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

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({ // eslint-disable-line new-cap
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true })
}))
export default class ButtonMoveChildDecorated extends ButtonMoveChild {}
