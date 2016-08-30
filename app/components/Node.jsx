import React from 'react'
//import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { putNode, deleteNode } from '../actions/nodes.js'
import { setIsEditing, unsetIsEditing } from '../actions/ui.js'
import NodeAdd from '../components/NodeAdd.jsx'

export default class Node extends React.Component {

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      isExpanded: false,
      value: props.title
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ value: props.title })
  }

  handleClick () {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  handleClickEdit () {
    const { dispatch, id } = this.props
    dispatch(setIsEditing(id))

    //const id = this.props.id
    //const inputKey = `input.${ id }`
    //ReactDOM.findDOMNode(this.refs[inputKey]).focus()
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { dispatch, id } = this.props
    dispatch(putNode(id, { title: this.state.value }))
    dispatch(unsetIsEditing())
  }

  handleClickDelete () {
    const { dispatch, id } = this.props
    dispatch(deleteNode(id))
  }

  render () {

    const { id, title = '', nodes = [], ui, dispatch } = this.props
    const isEditing = ui.isEditing === id
    const { value, isExpanded } = this.state
    const className = isEditing ? ['node -is-editing'].join(' ') : 'node'

    const inputRef = `input.${ id }`

    const isExpandedClass = isExpanded ? '-is-expanded' : ''

    return (
      <li className={ isExpandedClass }>

        <div className={ className }>
          <button onClick={ this.handleClickDelete }>X</button>
          <button onClick={ this.handleClickEdit }>E</button>
          <div className="node-content" onClick={ this.handleClick }><span>{ title }</span></div>
          <form onSubmit={ this.handleSubmit }>
            <button>S</button>
            <div className="input-wrap">
              <input ref={ inputRef } value={ value } onChange={ this.handleChange }></input>
            </div>
          </form>
        </div>

        <ul>
          { nodes.map((node, index) => {
            return (<Node key={ index } dispatch={ dispatch } id={ node._id } title={ node.title } nodes={ node.nodes } ui={ ui }></Node>)
          } ) }
          <li>
            <div className="node-add">
              <NodeAdd parent={ id } dispatch={ dispatch } ui={ ui }></NodeAdd>
            </div>
          </li>
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
    nodes: props.nodes,
    ui: props.ui
  }))
)(Node)
