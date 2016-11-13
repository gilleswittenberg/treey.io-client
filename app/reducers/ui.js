/* @flow */

import type { UIState, UIAction } from '../../flow/types'

import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export const defaultState: UIState = {
  lang: DEFAULT_LANG,
  enableDnD: true
}

export default function ui (state: UIState = defaultState/* , action: UIAction */) {
  return { ...state }
}
