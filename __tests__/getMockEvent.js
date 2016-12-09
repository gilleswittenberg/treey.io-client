/* @flow */

import noop from './noop'

export default (props: any) => ({
  stopPropagation: noop,
  preventDefault: noop,
  ...props
})
