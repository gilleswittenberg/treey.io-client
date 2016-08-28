jest.unmock('../app/lib/Tree.js')
jest.unmock('immutable')

import tree from '../app/lib/Tree.js'

describe('Tree', () => {

  describe('_getKeyPath', () => {

    it('root', () => {
      const treeData = {
        _id: '1'
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), '1')).toEqual([])
    })

    it('1st child', () => {
      const treeData = {
        _id: '1',
        nodes: [{ _id: 'c0' }]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'c0')).toEqual([0])
    })

    it('1st child 2', () => {
      const treeData = {
        _id: '1',
        nodes: [{ _id: 'c0' }, { _id: 'c1' }]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'c1')).toEqual([1])
    })

    it('2nd child 2', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c0' },
          { _id: 'c1', nodes: [
            { _id: 'cc0' },
            { _id: 'cc1' },
            { _id: 'cc2' }
          ] } ]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'cc2')).toEqual([1, 2])
    })

    it('3rd child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c0' },
          { _id: 'c1', nodes: [
            { _id: 'cc0' },
            { _id: 'cc1' },
            { _id: 'cc2' },
            { _id: 'cc3', nodes: [
              { _id: 'ccc0' },
              { _id: 'ccc1' },
              { _id: 'ccc2' }
            ] },
            { _id: 'cc4' }
          ] } ]
      }
      expect(tree._getKeyPath(tree._fromJS(treeData), 'ccc2')).toEqual([1, 3, 2])
    })
  })

  describe('create', () => {

    it('root without children', () => {
      const treeData = {
        _id: '1'
      }
      const data = {
        _id: 'c1',
        title: 'Name with spaces'
      }
      const newTreeData = tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0]).toEqual(data)
    })

    it('root with children', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const data = {
        _id: 'c3',
        title: 'Name with spaces'
      }
      const newTreeData = tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(3)
      expect(newTreeData.nodes[2]).toEqual(data)
    })

    it('first child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const data = {
        _id: 'cc1',
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
        _id: '1'
      }
      const data = {
        title: 'Root'
      }
      const newTreeData = tree.update(treeData, '1', data)
      expect(newTreeData.title).toEqual('Root')
    })

    it('first child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const data = {
        _id: 'c1',
        title: 'First child'
      }
      const newTreeData = tree.update(treeData, 'c2', data)
      expect(newTreeData.nodes[1].title).toEqual('First child')
    })
  })

  describe('update', () => {

    it('root', () => {
      const treeData = {
        _id: '1'
      }
      const data = {
        title: 'Root'
      }
      const newTreeData = tree.update(treeData, '1', data)
      expect(newTreeData.title).toEqual('Root')
    })

    it('first child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const data = {
        _id: 'c1',
        title: 'First child'
      }
      const newTreeData = tree.update(treeData, 'c2', data)
      expect(newTreeData.nodes[1].title).toEqual('First child')
    })
  })

  describe('delete', () => {

    it('root', () => {
      const treeData = {
        _id: '1'
      }
      const newTreeData = tree.delete(treeData, '1')
      expect(newTreeData).toEqual({})
    })

    it('first child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const newTreeData = tree.delete(treeData, 'c2')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0]._id).toEqual('c1')
    })
  })
})
