/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Nodes from './Nodes'
import CustomDragLayer from '../components/CustomDragLayer'
import autobind from 'autobind-decorator'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import delay from '../lib/utils/delay'
import { getNextActive, getPrevActive } from '../lib/tree/getNextPrevActive'
import { getNodeFromTreePath } from '../lib/tree/TreeUtils'

class Tree extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    tree: PropTypes.object,
    ui: PropTypes.object.isRequired,
    nodesArray: PropTypes.array.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired
  }

  static defaultProps = {
    enableDnD: false,
    tree: null
  }

  // Needed for Flowtype
  static DecoratedComponent = null

  state = {
    redirectToNodeId: null
  }

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
    // Esc
    if (event.keyCode === 27) {
      const { clearUIEditingAdding } = this.props
      clearUIEditingAdding()
    }
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const { setUIActive, nodesArray: nodes, ui: { expanded, active, adding, editing } } = this.props

    // Guard
    if (adding != null || editing != null) return

    let action, nextActive, activeNode

    switch (event.keyCode) {
    // Down arrow
    case 40:
      nextActive = getNextActive(nodes, active, expanded)
      break
    // Up arrow
    case 38:
      nextActive = getPrevActive(nodes, active, expanded)
      break
    // Tab
    case 9:
      action = event.shiftKey ? getPrevActive : getNextActive
      nextActive = action(nodes, active, expanded)
      break
    // I
    case 73:
      if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        activeNode = getNodeFromTreePath(active)
        if (activeNode != null) {
          this.setState({ redirectToNodeId: activeNode })
        }
      }
      return
    default:
      return
    }

    event.preventDefault()
    setUIActive(nextActive)
  }

  @autobind
  handleWindowClick () {
    const { clearUIEditingAdding } = this.props
    // This needs to be delayed to be called after a possible submit event
    delay(() => clearUIEditingAdding())
  }

  render () {

    const { redirectToNodeId } = this.state

    if (redirectToNodeId != null) {
      return <Redirect to={ `/node/${ redirectToNodeId }` } />
    }

    const {
      enableDnD,
      nodesArray
    } = this.props

    const nodes = nodesArray.length > 0 ? [nodesArray[0].uuid] : []
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
const backend = TouchBackend(touchBackendOptions) // eslint-disable-line new-cap

@DragDropContext(backend) // eslint-disable-line new-cap
export default class TreeDecorated extends Tree {}
