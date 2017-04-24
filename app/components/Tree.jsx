/* @flow */

import React, { Component, PropTypes } from 'react'
import Nodes from './Nodes'
import CustomDragLayer from '../components/CustomDragLayer'
import autobind from 'autobind-decorator'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import delay from '../lib/utils/delay'
import { getNextActive, getPrevActive } from '../lib/tree/getNextPrevActive'

class Tree extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    tree: PropTypes.object,
    nodesArray: PropTypes.array.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired
  }

  static defaultProps = {
    enableDnD: false,
    tree: null
  }

  // needed for Flowtype
  static DecoratedComponent = null

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('click', this.handleWindowClick)
  }

  @autobind
  handleKeyUp (event: KeyboardEvent) {
    if (event.keyCode === 27) { // esc
      const { clearUIEditingAdding } = this.props
      clearUIEditingAdding()
    }
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const { setUIActive, nodesArray: nodes, ui: { expanded, active, adding, editing } } = this.props

    // guard
    if (adding != null || editing != null) return

    let action, nextActive

    switch (event.keyCode) {
    case 40: // down arrow
      nextActive = getNextActive(nodes, active, expanded)
      break
    case 38: // up arrow
      nextActive = getPrevActive(nodes, active, expanded)
      break
    case 9: // tab
      action = event.shiftKey ? getPrevActive : getNextActive
      nextActive = action(nodes, active, expanded)
      break
    default:
      return
    }

    event.preventDefault()
    setUIActive(nextActive)
  }

  @autobind
  handleWindowClick () {
    const { clearUIEditingAdding } = this.props
    // this needs to be delayed to be called after a possible submit event
    delay(() => clearUIEditingAdding())
  }

  render () {

    const {
      enableDnD,
      nodesArray
    } = this.props

    const nodes = nodesArray.length > 0 ? [nodesArray[0].uid] : []
    const showNodes = nodes.length > 0
    const nodesProps = { ...this.props, parent: null, treePath: [], nodesArray, nodes }

    // $FlowIssue Flow does not recognize CustomDragLayer.DecoratedComponent
    const CustomDragLayerComponent = enableDnD ? CustomDragLayer : CustomDragLayer.DecoratedComponent

    return (
      <div className="tree">
        { showNodes && <Nodes { ...nodesProps } /> }
        <CustomDragLayerComponent />
      </div>
    )
  }
}

const touchBackendOptions = { enableMouseEvents: true, delayTouchStart: 400 }
const backend = TouchBackend(touchBackendOptions)

@DragDropContext(backend)
export default class TreeDecorated extends Tree {}
