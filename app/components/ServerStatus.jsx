/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'
import __ from '../lib/utils/i18n'
import type { Lang } from '../../flow/types'

type Props = {
  lang: Lang,
  hasErrors: boolean,
  isSyncing: boolean
}

export default class ServerStatus extends Component<Props> {

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
