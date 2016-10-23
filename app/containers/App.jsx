/* @flow */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
import { setIsEditing, unsetIsEditing, setShowButtons, expand, toggleExpanded } from '../actions/ui'
import { postNode, putNode, deleteNode, putMoveNode } from '../actions/nodes'
import classNames from 'classnames'

let nodesActions = { postNode, putNode, deleteNode, putMoveNode }
let uiActions = { setIsEditing, unsetIsEditing, setShowButtons, expand, toggleExpanded }
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

  constructor (props) {
    super(props)
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
    const { tree, isSyncing, hasErrors } = nodes

    uiActionsBound = bindActionCreators(uiActions, dispatch)
    nodesActionsBound = bindActionCreators(nodesActions, dispatch)

    const serverStatusClassName = classNames('server-status', {
      '-has-errors': hasErrors,
      '-is-syncing': isSyncing
    })

    return (
      <div className="wrap">
        <div className={ serverStatusClassName }>
          <p className="server-status-has-errors">has errors</p>
          <p className="server-status-is-syncing">is syncing&hellip;</p>
        </div>
        <div className="tree">
        { tree &&
          <Nodes
            parent={ null }
            nodes={ [tree] }
            ui={ ui }
            { ...uiActionsBound }
            { ...nodesActionsBound }
          />
        }
          <CustomDragLayer></CustomDragLayer>
        </div>
      </div>
    )
  }
}

export default connect((state, props) => ({
  dispatch: props.dispatch,
  nodes: state.nodes,
  ui: state.ui
}))(App)
