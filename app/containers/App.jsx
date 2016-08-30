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
    const ui = this.props.ui
    const id = tree ? tree._id : null
    const dispatch = this.props.dispatch

    return (
      <div className="wrap">
        <ul>
          <Node dispatch={ dispatch } id={ id } title={ title } nodes={ nodes } ui={ ui }></Node>
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
