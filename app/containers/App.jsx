import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Nodes from '../components/Nodes'
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

    return (
      <div className="wrap">
        { tree &&
          <Nodes dispatch={ dispatch } parent={ null } nodes={ [tree] } ui={ ui } />
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
