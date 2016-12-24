/* @flow */

import type { UserState } from '../../flow/types'
import ROOT_UID from '../settings/ROOT_UID'

export const defaultState: UserState = {
  username: 'gilleswittenberg',
  rootId: ROOT_UID
}

export default function user (state: UserState = defaultState) {
  return { ...state }
}
