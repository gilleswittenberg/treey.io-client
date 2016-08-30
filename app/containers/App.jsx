import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Node from '../components/Node.jsx'
import AddForm from '../components/AddForm.jsx'

class App extends React.Component {

  render () {
    const { nodes, ui, dispatch } = this.props
    const { tree } = nodes
    const { _id: id = null, title = '', nodes: treeNodes = [] } = tree
    
    return (
      <div className="wrap">
        <ul>
          <Node dispatch={ dispatch } id={ id } title={ title } nodes={ treeNodes } ui={ ui }></Node>
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
