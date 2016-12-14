/* @flow */

import isType from '../../../app/lib/utils/isType'
import type { Type } from '../../../flow/types'

const Storage = {

  set (key: string, item: any) : bool {

    try {
      const value = JSON.stringify(item)
      window.localStorage.setItem(key, value)
      return true
    } catch (err) {
      return false
    }
  },

  get (key: string, type?: Type) : bool | any {

    let parsedValue

    try {
      const value = window.localStorage.getItem(key)
      parsedValue = value ? JSON.parse(value) : null
      if (type !== undefined) {
        if (!isType(type, parsedValue)) {
          return false
        }
      }
      return parsedValue
    } catch (err) {
      return false
    }
  },

  clear () : bool {
    try {
      window.localStorage.clear()
      return true
    } catch (err) {
      return false
    }
  }
}

export default Storage
