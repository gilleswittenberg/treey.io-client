import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
import { setIsEditing, unsetIsEditing } from '../actions/ui'
import { postNode, putNode, deleteNode } from '../actions/nodes'

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
    const { dispatch } = this.props
    dispatch(unsetIsEditing())
  }

  setIsEditing (key) {
    const { dispatch } = this.props
    dispatch(setIsEditing(key))
  }

  unsetIsEditing () {
    const { dispatch } = this.props
    dispatch(unsetIsEditing())
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
    const { nodes, ui } = this.props
    const { tree } = nodes

    return (
      <div className="wrap">
        { tree &&
          <Nodes
            parent={ null }
            nodes={ [tree] }
            ui={ ui }
            setIsEditing={ this.setIsEditing.bind(this) }
            unsetIsEditing={ this.unsetIsEditing.bind(this) }
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
