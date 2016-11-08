/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class NodeOver extends Component {

  static propTypes = {
    position: PropTypes.oneOf(['above', 'below', 'child']).isRequired
  }

  render () {
    const { position } = this.props
    const classNamePosition = `node-over-${ position }`
    const className = classNames('node-over', classNamePosition)
    return (
      <div className={ className }>
        <div></div>
      </div>
    )
  }
}
