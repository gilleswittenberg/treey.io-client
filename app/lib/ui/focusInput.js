/* @flow */
export default (input: any) => {
  // @TODO: Use util isType('function')
  if (input && typeof input.focus === 'function') input.focus()
}
