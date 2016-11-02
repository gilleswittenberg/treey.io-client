import React from 'react'

export default function getComponent (Component, defaultProps) {

  return function (componentProps) {

    const props = { ...defaultProps, ...componentProps }
    return React.createElement(Component, props)
  }
}
