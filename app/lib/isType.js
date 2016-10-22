/* @flow */

import type { Type } from '../../flow/types'

export default function isType (type: Type, value: any) {
  switch (type) {
  case 'boolean':
    return typeof value === 'boolean'
  case 'number':
    return typeof value === 'number'
  case 'string':
    return typeof value === 'string'
  case '[]':
    return Array.isArray(value)
  case 'boolean[]':
    if (!Array.isArray(value)) {
      return false
    }
    return value.filter(v => isType('boolean', v)).length === value.length
  case 'number[]':
    if (!Array.isArray(value)) {
      return false
    }
    return value.filter(v => isType('number', v)).length === value.length
  case 'string[]':
    if (!Array.isArray(value)) {
      return false
    }
    return value.filter(v => isType('string', v)).length === value.length
  }
}
