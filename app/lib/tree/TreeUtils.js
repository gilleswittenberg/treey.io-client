import type { TreePath, NodeId } from '../../../flow/tree'

export const getUidFromTreePath = (arr: ?TreePath) : ?NodeId => {
  if (arr == null) return null
  if (arr.length === 0) return null
  return arr[arr.length - 1]
}

export const getParentFromTreePath = (arr: ?TreePath) : ?NodeId => {
  if (arr == null) return null
  if (arr.length < 2) return null
  return arr[arr.length - 2]
}
