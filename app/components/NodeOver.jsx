/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'

type Props = {
  position: 'above' | 'below' | 'child',
  title?: string
}

export default class NodeOver extends Component<Props> {

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
