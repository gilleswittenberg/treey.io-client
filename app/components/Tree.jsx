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
    clearUIEditing: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
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
    if (tree === null && nextProps.tree) {
      const { tree: { path } } = nextProps
      setUIActive(path)
      setUIExpanded(path)
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyPress)
    window.addEventListener('click', this.handleWindowClick)
  }

  @autobind
  handleKeyPress (event: KeyboardEvent) {
    // @TODO: Use switch
    // @TODO: move esc to keyup
    if (event.keyCode === 27) { // esc
      const { clearUIEditing } = this.props
      clearUIEditing()
    } else if (event.keyCode === 40) { // down arrow
      event.preventDefault()
      const { setNextUIActive } = this.props
      setNextUIActive()
    } else if (event.keyCode === 38) { // up arrow
      event.preventDefault()
      const { setPrevUIActive } = this.props
      setPrevUIActive()
    } else if (event.keyCode === 37) { // left arrow
      event.preventDefault()
      const { updateActiveNodeUI } = this.props
      updateActiveNodeUI('expanded', false)
    } else if (event.keyCode === 39) { // right arrow
      event.preventDefault()
      const { updateActiveNodeUI } = this.props
      updateActiveNodeUI('expanded', true)
    }
  }

  @autobind
  handleWindowClick () {
    const { clearUIEditing } = this.props
    // this needs to be delayed to be called after a possible submit event
    delay(() => clearUIEditing())
  }

  render () {

    const {
      enableDnD,
      tree
    } = this.props

    const nodes = tree ? tree.nodes : []
    const nodesProps = { ...this.props, parent: null, nodes, ui: defaultUI }

    // $FlowIssue Flow does not recognize CustomDragLayer.DecoratedComponent
    const CustomDragLayerComponent = enableDnD ? CustomDragLayer : CustomDragLayer.DecoratedComponent

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
