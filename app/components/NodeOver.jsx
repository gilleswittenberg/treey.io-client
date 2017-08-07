/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class NodeOver extends Component {

  static propTypes = {
    position: PropTypes.oneOf(['above', 'below', 'child']).isRequired,
    title: PropTypes.string
  }

  render () {
    const { position, title } = this.props
    const classNamePosition = `node-over-${ position }`
    const className = classNames('node-over', classNamePosition)
    const titleString = title != null ? title : ''
    return (
      <div className={ className }>
        <div>
          <span>{ titleString }</span>
        </div>
      </div>
    )
  }
}
