import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node'
import { unsetIsEditing } from '../actions/ui'

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

  render () {
    const { nodes, ui, dispatch } = this.props
    const { tree } = nodes
    const { _id: id = null, title = '', nodes: treeNodes = [] } = tree

    return (
      <div className="wrap">
        <ul>
          <li><Node dispatch={ dispatch } id={ id } title={ title } nodes={ treeNodes } ui={ ui }></Node></li>
        </ul>
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
