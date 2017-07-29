/* @flow */

import type { NodeId } from '../../../flow/tree'

export default function getNextSibling (siblings: NodeId[], index: number) : ?NodeId {
  const nextNode = siblings[index + 1]
  return nextNode != null ? nextNode : null
}
