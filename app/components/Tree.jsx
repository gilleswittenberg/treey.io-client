/* @flow */

import React, { PropTypes } from 'react'
import Nodes from './Nodes'
import CustomDragLayer from '../components/CustomDragLayer'
import autobind from 'autobind-decorator'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

export class Tree extends React.Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    tree: PropTypes.object,
    unsetIsEditing: PropTypes.func.isRequired
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  @autobind
  handleKeyPress (event: KeyboardEvent) {
    if (event.keyCode === 27) { // esc
      const { unsetIsEditing } = this.props
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
        <CustomDragLayer />
      </div>
    )
  }
}

const touchBackendOptions = { enableMouseEvents: true, delayTouchStart: 400 }
const backend = TouchBackend(touchBackendOptions)

@DragDropContext(backend)
export default class TreeDecorated extends Tree {}
