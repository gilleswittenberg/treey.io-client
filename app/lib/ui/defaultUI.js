/* @flow */

import type { UIState } from '../../../flow/types'

const defaultUI: UIState = {
  expanded: {},
  active: null,
  adding: null,
  editing: null,
  dragging: null,
  movingChild: null,
  buttonsShown: null
}

export default defaultUI
