/* @flow */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServerStatus from '../components/ServerStatus'
import Nodes from '../components/Nodes'
import { setIsEditing, unsetIsEditing, setIsDragging, unsetIsDragging, setShowButtons, expand, toggleExpanded } from '../actions/ui'
import { postNode, putNode, deleteNode, putMoveNode } from '../actions/nodes'

let nodesActions = { postNode, putNode, deleteNode, putMoveNode }
let uiActions = { setIsEditing, unsetIsEditing, setIsDragging, unsetIsDragging, setShowButtons, expand, toggleExpanded }
let uiActionsBound
let nodesActionsBound

import { DragDropContext } from 'react-dnd'
import { default as TouchBackend } from 'react-dnd-touch-backend'
import CustomDragLayer from '../components/CustomDragLayer'

const touchBackendOptions = { enableMouseEvents: true, delayTouchStart: 400 }
const backend = TouchBackend(touchBackendOptions)

@DragDropContext(backend)
class App extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    nodes: React.PropTypes.object.isRequired,
    ui: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  handleKeyPress (event) {
    if (event.keyCode === 27) { // esc
      uiActionsBound.unsetIsEditing()
    }
  }

  render () {
    const { dispatch, nodes, ui } = this.props
    const { lang } = ui
    const { tree, isSyncing, hasErrors } = nodes

    uiActionsBound = bindActionCreators(uiActions, dispatch)
    nodesActionsBound = bindActionCreators(nodesActions, dispatch)

    return (
      <div className="wrap">
        <ServerStatus lang={ lang } hasErrors={ hasErrors } isSyncing={ isSyncing } />
        <div className="tree">
          { tree &&
            <Nodes
              lang={ ui.lang }
              parent={ null }
              nodes={ [tree] }
              ui={ ui }
              { ...uiActionsBound }
              { ...nodesActionsBound }
            />
          }
        </div>
        <CustomDragLayer></CustomDragLayer>
      </div>
    )
  }
}

export default connect((state, props) => ({
  dispatch: props.dispatch,
  nodes: state.nodes,
  ui: state.ui
}))(App)
