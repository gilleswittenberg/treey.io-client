import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { deleteNode } from '../actions/nodes'

export default class Node extends React.Component {

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    console.log(this.props)
    const dispatch = this.props.dispatch
    const id = this.props.id
    dispatch(deleteNode(id))
  }

  render () {

    const title = this.props.title || ''
    const nodes = this.props.nodes || []
    const dispatch = this.props.dispatch

    return (
      <li>
        { title }
        <button onClick={ this.handleClick }>X</button>
        <ul>
          { nodes.map((node, index) => {
            return (<Node key={ index } dispatch={ dispatch } id={ node._id } title={ node.title } nodes={ node.nodes }></Node>)
          } ) }
        </ul>
      </li>
    )
  }
}

export default compose(
  connect((state, props) => ({
    dispatch: props.dispatch,
    id: props.id,
    title: props.title,
    nodes: props.nodes
  }))
)(Node)
