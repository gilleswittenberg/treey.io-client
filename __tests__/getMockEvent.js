import noop from './noop'

export default props => ({
  stopPropagation: noop,
  preventDefault: noop,
  ...props
})
