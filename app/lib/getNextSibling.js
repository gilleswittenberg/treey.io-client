export default function getNextSibling (siblings: [{ uid: string }], index: number) : ?string {
  const nextNode = siblings[index + 1]
  if (!nextNode) return null
  return nextNode.uid
}
