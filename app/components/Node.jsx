import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { putNode, deleteNode } from '../actions/nodes.js'
import AddForm from '../components/AddForm.jsx'

export default class Node extends React.Component {

  constructor (props) {
    super(props)
    this.handleClickUpdate = this.handleClickUpdate.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      isEditing: false,
      value: props.title
    }
  }

  handleClickUpdate () {
    this.setState({ isEditing: true })
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const dispatch = this.props.dispatch
    const id = this.props.id
    dispatch(putNode(id, { title: this.state.value }))
    this.setState({ isEditing: false })
  }

  handleClickDelete () {
    const dispatch = this.props.dispatch
    const id = this.props.id
    dispatch(deleteNode(id))
  }

  render () {

    const id = this.props.id
    const title = this.props.title || ''
    const nodes = this.props.nodes || []
    const dispatch = this.props.dispatch
    const isEditing = this.state.isEditing
    const value = this.state.value

    return (
      <li>
        { !isEditing && <span>{ title }</span> }
        { isEditing && <form onSubmit={ this.handleSubmit }><input value={ value } onChange={ this.handleChange }></input><button>Submit</button></form> }
        <button onClick={ this.handleClickUpdate }>U</button>
        <button onClick={ this.handleClickDelete }>X</button>
        <ul>
          { nodes.map((node, index) => {
            return (<Node key={ index } dispatch={ dispatch } id={ node._id } title={ node.title } nodes={ node.nodes }></Node>)
          } ) }
          <li><AddForm parent={ id } dispatch={ dispatch }></AddForm></li>
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
