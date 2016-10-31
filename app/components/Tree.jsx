
import React, { PropTypes } from 'react'
import Nodes from './Nodes'
import autobind from 'autobind-decorator'

export default class Tree extends React.Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    tree: PropTypes.object
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  @autobind
  handleKeyPress (event) {
    if (event.keyCode === 27) { // esc
      const { actions: { unsetIsEditing } } = this.props
      unsetIsEditing()
    }
  }

  render () {

    const { ui, actions, tree } = this.props

    return (
      <div className="tree">
        { tree &&
          <Nodes
            ui={ ui }
            actions={ actions }
            parent={ null }
            nodes={ [tree] }
          />
        }
      </div>
    )
  }
}
