export default function getOverMousePosition (monitor, element) : string {
  const height = 34 // 32px height + 2px margin
  const clientOffset = monitor && monitor.getClientOffset()
  const yDrag = clientOffset ? clientOffset.y : 0
  const boundingClientRect = element && element.getBoundingClientRect()
  const yDrop = boundingClientRect ? boundingClientRect.top : 0
  const isOverPosition = yDrag - yDrop < height / 2 ? 'top' : 'bottom'
  return isOverPosition
}
