import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class AddForm extends React.Component {

  static propTypes = {
    parent: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired
  }

  state = {
    title: ''
  }

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

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
            <button onClick={ this.handleClick }>
              <i className="fa fa-plus-square-o"></i>
            </button>
          </div>
        }

        { isEditing &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <button disabled={ buttonDisabled }>
                  <i className="fa fa-floppy-o"></i>
                </button>
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

Node.propTypes = {
}

export default connect((state, props) => ({
  parent: props.parent,
  isEditing: props.isEditing,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  postNode: props.postNode
}))(AddForm)
