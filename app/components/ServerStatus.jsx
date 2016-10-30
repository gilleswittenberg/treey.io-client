/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import __ from '../lib/i18n'

export default class ServerStatus extends Component {

  static propTypes = {
    lang: PropTypes.string,
    hasErrors: PropTypes.bool,
    isSyncing: PropTypes.bool
  }

  static defaultProps = {
    lang: 'en',
    hasErrors: false,
    isSyncing: false
  }

  render () {

    const { lang, hasErrors, isSyncing } = this.props
    const className = classNames('server-status', {
      '-has-errors': hasErrors,
      '-is-syncing': isSyncing
    })

    return (
      <div className={ className }>
        <p className="server-status-has-errors">{ __(lang, 'HAS_ERRRORS') }</p>
        <p className="server-status-is-syncing">{ __(lang, 'IS_SYNCING') }</p>
      </div>
    )
  }
}
