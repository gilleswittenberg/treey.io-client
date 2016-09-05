import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
import * as uiActions from '../actions/ui'
import { postNode, putNode, deleteNode } from '../actions/nodes'

let nodesActions = { postNode, putNode, deleteNode }
let uiActionsBound
let nodesActionsBound

class App extends React.Component {

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
    const { tree } = nodes

    uiActionsBound = bindActionCreators(uiActions, dispatch)
    nodesActionsBound = bindActionCreators(nodesActions, dispatch)

    return (
      <div className="wrap">
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

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  nodes: React.PropTypes.object.isRequired,
  ui: React.PropTypes.object.isRequired
}

export default connect((state, props) => ({
  dispatch: props.dispatch,
  nodes: state.nodes,
  ui: state.ui
}))(App)
