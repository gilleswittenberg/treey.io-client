import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
import * as uiActions from '../actions/ui'
import { postNode, putNode, deleteNode } from '../actions/nodes'
import classNames from 'classnames'

let nodesActions = { postNode, putNode, deleteNode }
let uiActionsBound
let nodesActionsBound

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
    switch (event.key) {
    case 'Escape':
      uiActionsBound.unsetIsEditing()
    }
  }

  render () {
    const { dispatch, nodes, ui } = this.props
    const { tree, isSyncing } = nodes

    uiActionsBound = bindActionCreators(uiActions, dispatch)
    nodesActionsBound = bindActionCreators(nodesActions, dispatch)

    const serverStatusClassName = classNames('server-status', { hidden: !isSyncing })
    console.log(serverStatusClassName)

    return (
      <div className="wrap">
        <div className={ serverStatusClassName }><p>is syncing&hellip;</p></div>
        { tree &&
          <Nodes
            parent={ null }
            nodes={ [tree] }
            ui={ ui }
            { ...uiActionsBound }
            { ...nodesActionsBound }
          />
        }
      </div>
    )
  }
}

export default connect((state, props) => ({
  dispatch: props.dispatch,
  nodes: state.nodes,
  ui: state.ui
}))(App)
