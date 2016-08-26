import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node.jsx'

class App extends React.Component {
  render () {
    const tree = this.props.nodes.tree
    const title = tree ? tree.title : ''
    const nodes = tree ? tree.nodes : ''
    return (
      <ul>
        <Node title={ title } nodes={ nodes }></Node>
      </ul>
    )
  }
}

export default compose(
  connect(state => ({
    nodes: state.nodes
  }))
)(App)
