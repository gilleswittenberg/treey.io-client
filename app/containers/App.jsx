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
    const dispatch = this.props.dispatch

    return (
      <ul>
        <Node title={ title } nodes={ nodes }></Node>
        <li><AddForm dispatch={ dispatch } parent="57bedc40e81b0620300d769a"></AddForm></li>
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
