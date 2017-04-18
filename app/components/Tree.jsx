/* @flow */

import React, { Component, PropTypes } from 'react'
import Nodes from './Nodes'
import CustomDragLayer from '../components/CustomDragLayer'
import autobind from 'autobind-decorator'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import delay from '../lib/utils/delay'
import defaultUI from '../lib/ui/defaultUI'

class Tree extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    tree: PropTypes.object,
    nodesArray: PropTypes.array.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired,
    setNextUIActive: PropTypes.func.isRequired,
    setPrevUIActive: PropTypes.func.isRequired
  }

  static defaultProps = {
    enableDnD: false,
    tree: null
  }

  // needed for Flowtype
  static DecoratedComponent = null

  componentWillReceiveProps (nextProps: any) {
    const { tree, setUIActive, setUIExpanded } = this.props
    if (tree === null && nextProps.tree && nextProps.tree.nodes && nextProps.tree.nodes.length > 0) {
      const path = nextProps.tree.nodes[0].path
      setUIActive(path)
      setUIExpanded(path)
    }
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
    if (event.keyCode === 27) { // esc
      const { clearUIEditingAdding } = this.props
      clearUIEditingAdding()
    }
  }

  @autobind
  handleKeyDown (event: KeyboardEvent) {

    const { setNextUIActive, setPrevUIActive } = this.props
    let action

    switch (event.keyCode) {
    case 40: // down arrow
      event.preventDefault()
      setNextUIActive()
      break
    case 38: // up arrow
      event.preventDefault()
      setPrevUIActive()
      break
    case 9: // tab
      event.preventDefault()
      action = event.shiftKey ? setPrevUIActive : setNextUIActive
      action()
      break
    }
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
      // tree,
      nodesArray
    } = this.props

    // const nodes = tree ? tree.nodes : []
    const nodes = nodesArray.length > 0 ? [nodesArray[0].uid] : []
    const showNodes = nodes.length > 0
    const nodesProps = { ...this.props, parent: null, indexPath: [], nodesArray, nodes, ui: defaultUI }

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
