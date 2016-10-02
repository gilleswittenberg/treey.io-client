import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class AddForm extends Component {

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

  componentWillUpdate (nextProps) {
    if (nextProps.isEditing === true && this.props.isEditing === false) {
      this.setState({ title: '' })
    }
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

    const { parent, postNode, unsetIsEditing, expand } = this.props
    const { title } = this.state
    const titleTrimmed = title.trim()
    this.setState({ title: '' })

    // guard
    if (titleTrimmed === '') {
      unsetIsEditing()
      return
    }

    const data = { title: titleTrimmed }
    postNode(parent, data)
    unsetIsEditing()
    expand(parent)
  }

  render () {

    const { isEditing } = this.props
    const { title: value } = this.state

    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': isEditing }
    )

    return (
      <div className={ className }>

        { !isEditing &&
          <div className="node-body">
            <button onClick={ this.handleClick } title="add">
              <i className="fa fa-plus-square-o"></i>
            </button>
          </div>
        }

        { isEditing &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <button title="save">
                  <i className="fa fa-floppy-o"></i>
                </button>
              </div>
              <div className="input-wrap">
                <input
                  ref={ input => { if (input) input.focus() } }
                  onChange={ this.handleChange }
                  value={ value }
                  autoCapitalize="off"
                />
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
