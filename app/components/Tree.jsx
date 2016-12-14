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
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
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
    const { tree, updateNodeUI } = this.props
    if (tree === null && nextProps.tree) {
      const { tree: { path } } = nextProps
      updateNodeUI(path, 'active', true)
      updateNodeUI(path, 'expanded', true)
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
      const { clearNodeUI } = this.props
      // @TODO: combine
      clearNodeUI('editing')
      clearNodeUI('adding')
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
    const { clearNodeUI } = this.props
    // this needs to be delayed to be called after a possible submit event
    delay(() => {
      clearNodeUI('editing')
      clearNodeUI('adding')
    })
  }

  render () {

    const {
      enableDnD,
      tree
    } = this.props

    const nodesProps = { ...this.props, parent: null, nodes: [tree], ui: defaultUI }

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
