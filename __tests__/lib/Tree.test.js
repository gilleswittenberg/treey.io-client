import { fromJS } from 'immutable'
import Tree from '../../app/lib/Tree'

describe('Tree', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'

  describe('_getKeyPath', () => {

    describe('false', () => {

      it('non existing', () => {
        const treeData = {
          uid: '1'
        }
        expect(Tree._getKeyPath(fromJS(treeData), '2')).toEqual(false)
      })

      it('null', () => {
        const treeData = {
          uid: '1'
        }
        expect(Tree._getKeyPath(fromJS(treeData), null)).toEqual(false)
      })
    })

    describe('key path', () => {

      it('root', () => {
        const treeData = {
          uid: '1'
        }
        expect(Tree._getKeyPath(fromJS(treeData), '1')).toEqual([])
      })

      it('1st child', () => {
        const treeData = {
          uid: '1',
          nodes: [{ uid: 'c0' }]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'c0')).toEqual(['nodes', 0])
      })

      it('1st child 2', () => {
        const treeData = {
          uid: '1',
          nodes: [{ uid: 'c0' }, { uid: 'c1' }]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'c1')).toEqual(['nodes', 1])
      })

      it('2nd child 2', () => {
        const treeData = {
          uid: '1',
          nodes: [
            { uid: 'c0' },
            { uid: 'c1', nodes: [
              { uid: 'cc0' },
              { uid: 'cc1' },
              { uid: 'cc2' }
            ] } ]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'cc2')).toEqual(['nodes', 1, 'nodes', 2])
      })

      it('3rd child', () => {
        const treeData = {
          uid: '1',
          nodes: [
            { uid: 'c0' },
            { uid: 'c1', nodes: [
              { uid: 'cc0' },
              { uid: 'cc1' },
              { uid: 'cc2' },
              { uid: 'cc3', nodes: [
                { uid: 'ccc0' },
                { uid: 'ccc1' },
                { uid: 'ccc2' }
              ] },
              { uid: 'cc4' }
            ] } ]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'ccc2')).toEqual(['nodes', 1, 'nodes', 3, 'nodes', 2])
      })
    })

    describe('add nodes key', () => {

      it('root', () => {
        const treeData = {
          uid: '1'
        }
        expect(Tree._getKeyPath(fromJS(treeData), '1', true)).toEqual(['nodes'])
      })

      it('1st child', () => {
        const treeData = {
          uid: '1',
          nodes: [{ uid: 'c0' }]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'c0', true)).toEqual(['nodes', 0, 'nodes'])
      })

      it('3rd child', () => {
        const treeData = {
          uid: '1',
          nodes: [
            { uid: 'c0' },
            { uid: 'c1', nodes: [
              { uid: 'cc0' },
              { uid: 'cc1' },
              { uid: 'cc2' },
              { uid: 'cc3', nodes: [
                { uid: 'ccc0' },
                { uid: 'ccc1' },
                { uid: 'ccc2' }
              ] },
              { uid: 'cc4' }
            ] } ]
        }
        expect(Tree._getKeyPath(fromJS(treeData), 'ccc2', true)).toEqual(['nodes', 1, 'nodes', 3, 'nodes', 2, 'nodes'])
      })
    })
  })

  describe('pathToKeyPath', () => {

    it('root', () => {
      const path = `/${ uid }`
      expect(Tree._pathToKeyPath(path)).toEqual([])
    })

    it('1st generation', () => {
      const path = `/${ uid }/${ uid1 }`
      expect(Tree._pathToKeyPath(path)).toEqual(['nodes', uid1])
    })

    it('2nd generation', () => {
      const path = `/${ uid }/${ uid1 }/${ uid2 }`
      expect(Tree._pathToKeyPath(path)).toEqual(['nodes', uid1, 'nodes', uid2])
    })
  })

  describe('setNodeKey', () => {

    it('root', () => {
      const treeData = { uid, ui: { active: false } }
      expect(Tree.setNodeKey(treeData, uid, 'ui.active', true).ui.active).toBe(true)
    })

    it('1st generation', () => {
      const treeData = { uid, nodes: [{ uid: uid1, ui: { active: false } }] }
      expect(Tree.setNodeKey(treeData, uid1, 'ui.active', true).nodes[0].ui.active).toBe(true)
    })

    it('2nd generation', () => {
      const treeData = {
        uid,
        nodes: [{
          uid: uid1,
          nodes: [{ uid: uid2, ui: { active: false } }]
        }]
      }
      expect(Tree.setNodeKey(treeData, uid2, 'ui.active', true).nodes[0].nodes[0].ui.active).toBe(true)
    })
  })

  describe('create', () => {

    it('root without children', () => {
      const treeData = {
        uid: '1'
      }
      const data = {
        uid: 'c1',
        data: {
          title: 'Name with spaces'
        }
      }
      const newTreeData = Tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0]).toEqual(data)
    })

    it('root with children', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const data = {
        uid: 'c3',
        data: {
          title: 'Name with spaces'
        }
      }
      const newTreeData = Tree.create(treeData, '1', data)
      expect(newTreeData.nodes.length).toEqual(3)
      expect(newTreeData.nodes[2]).toEqual(data)
    })

    it('first child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const data = {
        uid: 'cc1',
        data: {
          title: 'Grand child'
        }
      }
      const newTreeData = Tree.create(treeData, 'c2', data)
      expect(newTreeData.nodes[1].nodes.length).toEqual(1)
      expect(newTreeData.nodes[1].nodes[0]).toEqual(data)
    })
  })

  describe('update', () => {

    it('root', () => {
      const treeData = {
        uid: '1'
      }
      const data = {
        data: {
          title: 'Root'
        }
      }
      const newTreeData = Tree.update(treeData, '1', data)
      expect(newTreeData.data.title).toEqual('Root')
    })

    it('first child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const data = {
        uid: 'c1',
        data: {
          title: 'First child'
        }
      }
      const newTreeData = Tree.update(treeData, 'c2', data)
      expect(newTreeData.nodes[1].data.title).toEqual('First child')
    })
  })

  describe('remove child', () => {

    it('non existing child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.removeChild(treeData, '1', 'c3')
      expect(newTreeData).toEqual(treeData)
    })

    it('first child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.removeChild(treeData, '1', 'c1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].uid).toEqual('c2')
    })

    it('second child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          {
            uid: 'c2',
            nodes: [
              { uid: 'cc1' },
              { uid: 'cc2' }
            ]
          }
        ]
      }
      const newTreeData = Tree.removeChild(treeData, 'c2', 'cc1')
      expect(newTreeData.nodes[1].nodes.length).toEqual(1)
      expect(newTreeData.nodes[1].nodes[0].uid).toEqual('cc2')
    })
  })

  describe('delete', () => {

    it('root', () => {
      const treeData = {
        uid: '1'
      }
      const newTreeData = Tree.delete(treeData, '1')
      expect(newTreeData).toEqual({})
    })

    it('first child', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.delete(treeData, 'c2')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].uid).toEqual('c1')
    })
  })

  describe('move', () => {

    it('same parent', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.move(treeData, '1', 'c1', '1')
      expect(newTreeData.nodes.length).toEqual(2)
      expect(newTreeData.nodes[1].uid).toEqual('c1')
    })

    it('same parent before', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' },
          { uid: 'c3' }
        ]
      }
      const newTreeData = Tree.move(treeData, '1', 'c1', '1', 'c3')
      expect(newTreeData.nodes.length).toEqual(3)
      expect(newTreeData.nodes[0].uid).toEqual('c2')
      expect(newTreeData.nodes[1].uid).toEqual('c1')
      expect(newTreeData.nodes[2].uid).toEqual('c3')
    })

    it('different parent', () => {
      const treeData = {
        uid: '1',
        nodes: [
          {
            uid: 'c1',
            nodes: [
              { uid: 'cc1' },
              { uid: 'cc2' }
            ]
          },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.move(treeData, '1', 'c2', 'c1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes.length).toEqual(3)
      expect(newTreeData.nodes[0].nodes[2].uid).toEqual('c2')
    })

    it('different parent before', () => {
      const treeData = {
        uid: '1',
        nodes: [
          {
            uid: 'c1',
            nodes: [
              { uid: 'cc1' },
              { uid: 'cc2' }
            ]
          },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.move(treeData, '1', 'c2', 'c1', 'cc1')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes.length).toEqual(3)
      expect(newTreeData.nodes[0].nodes[0].uid).toEqual('c2')
    })

    it('move to node without children', () => {
      const treeData = {
        uid: '1',
        nodes: [
          { uid: 'c1' },
          { uid: 'c2' }
        ]
      }
      const newTreeData = Tree.move(treeData, '1', 'c1', 'c2')
      expect(newTreeData.nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes.length).toEqual(1)
      expect(newTreeData.nodes[0].nodes[0].uid).toEqual('c1')
    })
  })
})
