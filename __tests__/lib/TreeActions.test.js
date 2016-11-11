import { updateNode, createNode } from '../../app/lib/TreeActions'

describe('TreeActions', () => {

  describe('updateNode', () => {

    it('function', () => {
      expect(typeof updateNode()).toBe('function')
    })
  })

  describe('createNode', () => {

    it('function', () => {
      expect(typeof createNode()).toBe('function')
    })

    it('return', () => {
      const data = {
        title: 'new node'
      }
      const node = createNode(data)()
      expect(node.data.title).toBe('new node')
    })
  })
})
