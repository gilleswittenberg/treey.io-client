/* @flow */

import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'
import { setIsEditing, unsetIsEditing, setIsDragging, unsetIsDragging, setShowButtons, expand, toggleExpanded } from '../actions/ui'
import { postNode, putNode, deleteNode, putMoveNode } from '../actions/nodes'

let nodesActions = { postNode, putNode, deleteNode, putMoveNode }
let uiActions = { setIsEditing, unsetIsEditing, setIsDragging, unsetIsDragging, setShowButtons, expand, toggleExpanded }

import { DragDropContext } from 'react-dnd'
import { default as TouchBackend } from 'react-dnd-touch-backend'
import CustomDragLayer from '../components/CustomDragLayer'

const touchBackendOptions = { enableMouseEvents: true, delayTouchStart: 400 }
const backend = TouchBackend(touchBackendOptions)

@DragDropContext(backend)
class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodes: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  render () {
    const {
      dispatch,
      ui,
      ui: { lang },
      nodes: { tree, isSyncing, hasErrors }
    } = this.props

    const uiActionsBound = bindActionCreators(uiActions, dispatch)
    const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
    const actions = { ...uiActionsBound, ...nodesActionsBound }

    return (
      <div className="wrap">
        <ServerStatus
          lang={ lang }
          hasErrors={ hasErrors }
          isSyncing={ isSyncing }
        />
        <Tree ui={ ui } actions={ actions } tree={ tree } />
        <CustomDragLayer />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)
