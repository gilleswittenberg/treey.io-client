/* @flow */

import { PropTypes } from 'react'

export default {
  active: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  adding: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  movingChild: PropTypes.bool.isRequired,
  buttonsShown: PropTypes.bool.isRequired
}
