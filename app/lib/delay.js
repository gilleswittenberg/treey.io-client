/* @flow */

export default (func: Function, ms: number = 0) : number => window.setTimeout(func, ms)
