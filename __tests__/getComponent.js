/* @flow */

import React from 'react'

export default function getComponent (Component: any, defaultProps: any) {

  return function (componentProps: any) {

    const props = { ...defaultProps, ...componentProps }
    return React.createElement(Component, props)
  }
}
