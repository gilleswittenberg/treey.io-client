import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
import * as uiActions from '../actions/ui'
import { postNode, putNode, deleteNode } from '../actions/nodes'

let uiActionsBounded

class App extends React.Component {

  constructor (props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  handleKeyPress (event) {
    switch (event.key) {
    case 'Escape':
      this.handleEscapePress()
    }
  }

  handleEscapePress () {
    uiActionsBounded.unsetIsEditing()
  }

  postNode (parent, data) {
    const { dispatch } = this.props
    dispatch(postNode(parent, data))
  }

  putNode (id, title) {
    const { dispatch } = this.props
    dispatch(putNode(id, { title }))
  }

  deleteNode (parent, id) {
    const { dispatch } = this.props
    dispatch(deleteNode(parent, id))
  }

  render () {
    const { dispatch, nodes, ui } = this.props
    const { tree } = nodes

    uiActionsBounded = bindActionCreators(uiActions, dispatch)

    return (
      <div className="wrap">
        { tree &&
          <Nodes
            parent={ null }
            nodes={ [tree] }
            ui={ ui }
            { ...uiActionsBounded }
            postNode={ this.postNode.bind(this) }
            putNode={ this.putNode.bind(this) }
            deleteNode={ this.deleteNode.bind(this) }
          />
        }
      </div>
    )
  }
}

export default compose(
  connect((state, props) => ({
    dispatch: props.dispatch,
    nodes: state.nodes,
    ui: state.ui
  }))
)(App)
