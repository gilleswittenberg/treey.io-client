/* @flow */

// @TODO: Rename component

import type { Lang } from '../../flow/types'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import __ from '../lib/utils/i18n'

type Props = {
  lang: Lang
}

export default class SignOutButton extends Component<Props> {

  render () {

    const { lang } = this.props

    return (
      <nav>
        <Link to="/">{ __(lang, 'BACK') }</Link>
      </nav>
    )
  }
}
