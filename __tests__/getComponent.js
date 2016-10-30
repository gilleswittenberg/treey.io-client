import React from 'react'

export default function getComponent (Component, defaultProps) {

  return function (args) {

    const props = { ...defaultProps, ...args }
    return React.createElement(Component, props, null)
  }
}
