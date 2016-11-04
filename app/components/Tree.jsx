/* @flow */

import React, { Component, PropTypes } from 'react'
import Nodes from './Nodes'
import CustomDragLayerDecorated, { CustomDragLayer } from '../components/CustomDragLayer'
import autobind from 'autobind-decorator'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

export class Tree extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    tree: PropTypes.object,
    unsetIsEditing: PropTypes.func.isRequired
  }

  static defaultProps = {
    enableDnD: false
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  @autobind
  handleKeyPress (event: KeyboardEvent) {
    if (event.keyCode === 27) { // esc
      const { unsetIsEditing } = this.props
      unsetIsEditing()
    }
  }

  render () {

    const {
      enableDnD,
      tree
    } = this.props

    const nodesProps = { ...this.props, parent: null, nodes: [tree] }
    const CustomDragLayerComponent = enableDnD ? CustomDragLayerDecorated : CustomDragLayer

    return (
      <div className="tree">
        { tree && <Nodes { ...nodesProps } /> }
        <CustomDragLayerComponent />
      </div>
    )
  }
}

const touchBackendOptions = { enableMouseEvents: true, delayTouchStart: 400 }
const backend = TouchBackend(touchBackendOptions)

@DragDropContext(backend)
export default class TreeDecorated extends Tree {}
