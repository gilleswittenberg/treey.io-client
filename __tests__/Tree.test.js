jest.unmock('../app/lib/Tree.js')
jest.unmock('immutable')

import tree from '../app/lib/Tree.js'

describe('Tree', () => {

  describe('_getKeyPath', () => {

    it('root', () => {
      const treeData = {
        id: '1'
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), '1')).toEqual([])
    })

    it('1st child', () => {
      const treeData = {
        id: '1',
        nodes: [{ id: 'c0' }]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'c0')).toEqual([0])
    })

    it('1st child 2', () => {
      const treeData = {
        id: '1',
        nodes: [{ id: 'c0' }, { id: 'c1' }]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'c1')).toEqual([1])
    })

    it('2nd child 2', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c0' },
          { id: 'c1', nodes: [
            { id: 'cc0' },
            { id: 'cc1' },
            { id: 'cc2' }
          ] } ]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'cc2')).toEqual([1, 2])
    })

    it('3rd child', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c0' },
          { id: 'c1', nodes: [
            { id: 'cc0' },
            { id: 'cc1' },
            { id: 'cc2' },
            { id: 'cc3', nodes: [
              { id: 'ccc0' },
              { id: 'ccc1' },
              { id: 'ccc2' }
            ] },
            { id: 'cc4' }
          ] } ]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'ccc2')).toEqual([1, 3, 2])
    })
  })

  describe('create', () => {

    it('root without children', () => {
      const treeData = {
        id: '1'
      }
      const data = {
        id: 'c1',
        title: 'Name with spaces'
      }
      const newTreeData = tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0]).toEqual(data)
    })

    it('root with children', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c1' },
          { id: 'c2' }
        ]
      }
      const data = {
        id: 'c3',
        title: 'Name with spaces'
      }
      const newTreeData = tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(3)
      expect(newTreeData.nodes[2]).toEqual(data)
    })

    it('first child', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c1' },
          { id: 'c2' }
        ]
      }
      const data = {
        id: 'cc1',
        title: 'Grand child'
      }
      const newTreeData = tree.create(treeData, 'c2', data)
      expect(newTreeData.nodes[1].nodes.length).toEqual(1)
      expect(newTreeData.nodes[1].nodes[0]).toEqual(data)
    })
  })

  describe('update', () => {

    it('root', () => {
      const treeData = {
        id: '1'
      }
      const data = {
        title: 'Root'
      }
      const newTreeData = tree.update(treeData, '1', data)
      expect(newTreeData.title).toEqual('Root')
    })

    it('first child', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c1' },
          { id: 'c2' }
        ]
      }
      const data = {
        id: 'c1',
        title: 'First child'
      }
      const newTreeData = tree.update(treeData, 'c2', data)
      expect(newTreeData.nodes[1].title).toEqual('First child')
    })
  })

  describe('update', () => {

    it('root', () => {
      const treeData = {
        id: '1'
      }
      const data = {
        title: 'Root'
      }
      const newTreeData = tree.update(treeData, '1', data)
      expect(newTreeData.title).toEqual('Root')
    })

    it('first child', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c1' },
          { id: 'c2' }
        ]
      }
      const data = {
        id: 'c1',
        title: 'First child'
      }
      const newTreeData = tree.update(treeData, 'c2', data)
      expect(newTreeData.nodes[1].title).toEqual('First child')
    })
  })

  describe('delete', () => {

    it('root', () => {
      const treeData = {
        id: '1'
      }
      const newTreeData = tree.delete(treeData, '1')
      expect(newTreeData).toEqual({})
    })

    it('first child', () => {
      const treeData = {
        id: '1',
        nodes: [
          { id: 'c1' },
          { id: 'c2' }
        ]
      }
      const newTreeData = tree.delete(treeData, 'c2')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].id).toEqual('c1')
    })
  })
})
