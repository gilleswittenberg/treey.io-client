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
    const {
      dispatch,
      nodes: { tree, isSyncing, hasErrors },
      ui: { lang }
    } = this.props

    uiActionsBound = bindActionCreators(uiActions, dispatch)
    nodesActionsBound = bindActionCreators(nodesActions, dispatch)
    const actions = { ...uiActionsBound, ...nodesActionsBound }

    return (
      <div className="wrap">
        <ServerStatus lang={ lang } hasErrors={ hasErrors } isSyncing={ isSyncing } />
        <div className="tree">
          { tree &&
            <Nodes
              parent={ null }
              nodes={ [tree] }
              actions={ actions }
            />
          }
        </div>
        <CustomDragLayer></CustomDragLayer>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)
