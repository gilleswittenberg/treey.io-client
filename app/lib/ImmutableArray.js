/* @flow */

import { List } from 'immutable'

const ImmutableArray = {

  add (arr: [], value: any) : [] {
    const list = new List(arr)
    const newList = list.includes(value) ? list : list.push(value)
    return newList.toArray()
  },

  remove (arr: [], value: any) : [] {
    const list = new List(arr)
    const index = list.findIndex(val => val === value)
    const newList = index > -1 ? list.remove(index) : list
    return newList.toArray()
  }
}

export default ImmutableArray
