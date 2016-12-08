/* @flow */

import type { HoverRegion } from '../../flow/types'

export default function getHoverRegion (monitor: any, element: any) : HoverRegion {
  const clientOffset = monitor && monitor.getClientOffset()
  const yDrag = clientOffset ? clientOffset.y : 0
  const boundingClientRect = element && element.getBoundingClientRect()
  const yDrop = boundingClientRect ? boundingClientRect.top : 0
  const height = boundingClientRect ? boundingClientRect.height : 0
  const isOverPosition = height / 2 < yDrag - yDrop ? 'bottom' : 'top'
  return isOverPosition
}
