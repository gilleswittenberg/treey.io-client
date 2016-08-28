import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node.jsx'
import AddForm from '../components/AddForm.jsx'

class App extends React.Component {
  render () {
    const tree = this.props.nodes.tree
    const title = tree ? tree.title : ''
    const nodes = tree ? tree.nodes : ''
    const id = tree ? tree._id : null
    const dispatch = this.props.dispatch

    return (
      <ul>
        <Node dispatch={ dispatch } id={ id } title={ title } nodes={ nodes }></Node>
      </ul>
    )
  }
}

export default compose(
  connect((state, props) => ({
    nodes: state.nodes,
    dispatch: props.dispatch
  }))
)(App)
