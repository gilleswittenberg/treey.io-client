/* @flow */

import type { AppState } from '../../flow/types'

import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export const defaultState: AppState = {
  lang: DEFAULT_LANG,
  enableDnD: true
}

export default function app (state: AppState = defaultState) {
  return { ...state }
}
