import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

export default class Node extends React.Component {

  render () {

    const title = this.props.title || ''
    const nodes = this.props.nodes || []

    return (
      <li>{ title }
        <ul>
          { nodes.map((node, index) => {
            return (<Node key={ index } title={ node.title } nodes={ node.nodes }></Node>)
          } ) }
        </ul>
      </li>
    )
  }
}

export default compose(
  connect((state, props) => ({
    title: props.title,
    nodes: props.nodes
  }))
)(Node)
