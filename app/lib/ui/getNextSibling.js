/* @flow */

import type { NodeId } from '../../../flow/tree'

export default function getNextSibling (siblings: [{ uuid: NodeId }], index: number) : ?NodeId {
  const nextNode = siblings[index + 1]
  if (!nextNode) return null
  return nextNode.uuid
}
