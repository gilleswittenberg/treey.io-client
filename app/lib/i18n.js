/* @flow */

import en from '../i18n/en'

const langs = { en }

import type { Lang } from '../../flow/types'

export default function (code: Lang, key: string) : string {

  const lang = langs[code]

  if (lang === undefined) {
    return `__ ${ code } ${ key } __`
  }

  const text = lang[key]

  if (text === undefined) {
    return `__ ${ key } __`
  }

  return text
}
