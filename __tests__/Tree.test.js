jest.unmock('../app/lib/Tree')
jest.unmock('immutable')

import tree from '../app/lib/Tree'

describe('Tree', () => {

  describe('_getKeyPath', () => {

    describe('false', () => {

      it('non existing', () => {
        const treeData = {
          _id: '1'
        }
        expect(tree._getKeyPath(tree._fromJS(treeData), '2')).toEqual(false)
      })

      it('null', () => {
        const treeData = {
          _id: '1'
        }
        expect(tree._getKeyPath(tree._fromJS(treeData), null)).toEqual(false)
      })
    })

    describe('key path', () => {

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
        expect(tree._getKeyPath(tree._fromJS(treeData), 'c0')).toEqual(['nodes', 0])
      })

      it('1st child 2', () => {
        const treeData = {
          _id: '1',
          nodes: [{ _id: 'c0' }, { _id: 'c1' }]
        }
        expect(tree._getKeyPath(tree._fromJS(treeData), 'c1')).toEqual(['nodes', 1])
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
        expect(tree._getKeyPath(tree._fromJS(treeData), 'cc2')).toEqual(['nodes', 1, 'nodes', 2])
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
        expect(tree._getKeyPath(tree._fromJS(treeData), 'ccc2')).toEqual(['nodes', 1, 'nodes', 3, 'nodes', 2])
      })
    })

    describe('add nodes key', () => {

      it('root', () => {
        const treeData = {
          _id: '1'
        }
        expect(tree._getKeyPath(tree._fromJS(treeData), '1', true)).toEqual(['nodes'])
      })

      it('1st child', () => {
        const treeData = {
          _id: '1',
          nodes: [{ _id: 'c0' }]
        }
        expect(tree._getKeyPath(tree._fromJS(treeData), 'c0', true)).toEqual(['nodes', 0, 'nodes'])
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
        expect(tree._getKeyPath(tree._fromJS(treeData), 'ccc2', true)).toEqual(['nodes', 1, 'nodes', 3, 'nodes', 2, 'nodes'])
      })
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

  describe('remove child', () => {

    it('non existing child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const newTreeData = tree.removeChild(treeData, '1', 'c3')
      expect(newTreeData).toEqual(treeData)
    })

    it('first child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          { _id: 'c2' }
        ]
      }
      const newTreeData = tree.removeChild(treeData, '1', 'c1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0]._id).toEqual('c2')
    })

    it('second child', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1' },
          {
            _id: 'c2',
            nodes: [
              { _id: 'cc1' },
              { _id: 'cc2' }
            ]
          }
        ]
      }
      const newTreeData = tree.removeChild(treeData, 'c2', 'cc1')
      expect(newTreeData.nodes[1].nodes.length).toEqual(1)
      expect(newTreeData.nodes[1].nodes[0]._id).toEqual('cc2')
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

  describe('move', () => {

    it('same parent', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1'},
          { _id: 'c2'}
        ]
      }
      const newTreeData = tree.move(treeData, '1', 'c1', '1')
      expect(newTreeData.nodes.length).toEqual(2)
      expect(newTreeData.nodes[1]._id).toEqual('c1')
    })

    it('same parent before', () => {
      const treeData = {
        _id: '1',
        nodes: [
          { _id: 'c1'},
          { _id: 'c2'},
          { _id: 'c3'}
        ]
      }
      const newTreeData = tree.move(treeData, '1', 'c1', '1', 'c3')
      expect(newTreeData.nodes.length).toEqual(3)
      expect(newTreeData.nodes[0]._id).toEqual('c2')
      expect(newTreeData.nodes[1]._id).toEqual('c1')
      expect(newTreeData.nodes[2]._id).toEqual('c3')
    })

    it('different parent', () => {
      const treeData = {
        _id: '1',
        nodes: [
          {
            _id: 'c1',
            nodes: [
              { _id: 'cc1' },
              { _id: 'cc2' }
            ]
          },
          { _id: 'c2'}
        ]
      }
      const newTreeData = tree.move(treeData, '1', 'c2', 'c1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes.length).toEqual(3)
      expect(newTreeData.nodes[0].nodes[2]._id).toEqual('c2')
    })

    it('different parent before', () => {
      const treeData = {
        _id: '1',
        nodes: [
          {
            _id: 'c1',
            nodes: [
              { _id: 'cc1' },
              { _id: 'cc2' }
            ]
          },
          { _id: 'c2'}
        ]
      }
      const newTreeData = tree.move(treeData, '1', 'c2', 'c1', 'cc1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes.length).toEqual(3)
      expect(newTreeData.nodes[0].nodes[0]._id).toEqual('c2')
    })
  })
})
