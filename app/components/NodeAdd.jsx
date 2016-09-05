import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

export default class AddForm extends React.Component {

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = { title: '' }
  }

  handleClick () {
    const { parent, setIsEditing } = this.props
    this.setState({ title: '' })
    setIsEditing(parent, 'add')
  }

  handleChange (event) {
    this.setState({ title: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { parent, postNode, unsetIsEditing } = this.props
    const { title } = this.state
    const data = { title }
    postNode(parent, data)
    unsetIsEditing()

    this.setState({ title: '' })
  }

  render () {

    const { isEditing } = this.props
    const { title: value } = this.state

    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': isEditing }
    )

    const buttonDisabled = this.state.value === ''

    return (
      <div className={ className }>

        { !isEditing &&
          <div className="node-body">
            <button onClick={ this.handleClick }>+</button>
          </div>
        }

        { isEditing &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <button disabled={ buttonDisabled }>+</button>
              </div>
              <div className="input-wrap">
                <input ref={ input => { if (input) input.focus() } } onChange={ this.handleChange } value={ value }></input>
              </div>
            </form>
          </div>
        }

      </div>
    )
  }
}

export default connect((state, props) => ({
  parent: props.parent,
  isEditing: props.isEditing,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  postNode: props.postNode
}))(AddForm)
