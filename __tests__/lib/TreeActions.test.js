import { updateNode, createNode, removeNode } from '../../app/lib/TreeActions'

describe('TreeActions', () => {

  describe('updateNode', () => {

    it('function', () => {
      expect(typeof updateNode()).toBe('function')
    })
  })

  describe('createNode', () => {

    describe('return', () => {

      it('data', () => {
        const data = {
          title: 'new node'
        }
        const node = createNode(data)()
        expect(node.data.title).toBe('new node')
        expect(node.uid).toBe(null)
      })

      it('uid', () => {
        const uid = '57bedc40e81b0620300d7690'
        const data = {
          title: 'new node'
        }
        const node = createNode(data, uid)()
        expect(node.uid).toBe(uid)
      })
    })
  })

  describe('removeNode', () => {

    it('function', () => {
      expect(typeof removeNode()).toBe('function')
    })
  })
})
