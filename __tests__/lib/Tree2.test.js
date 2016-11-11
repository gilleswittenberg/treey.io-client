import Tree2 from '../../app/lib/Tree2'
import { fromJS } from 'immutable'

describe('Tree2', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'

  describe('doActionAll', () => {

    describe('root', () => {

      it('action', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doActionAll(tree, action)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        // new value
        expect(newTree.title).toEqual('new title')
      })

      it('skip', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const action = node => node.set('title', 'new title')
        const skip = node => node.get('uid') === uid
        const newTree = Tree2.doActionAll(tree, action, skip)
        // new value skipped
        expect(newTree.title).toEqual('Mr. Foo')
      })
    })

    describe('1st generation', () => {

      it('action', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child'
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doActionAll(tree, action)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        expect(tree.nodes[0].title).toEqual('1st child')
        // new value
        expect(newTree.title).toEqual('new title')
        expect(newTree.nodes[0].title).toEqual('new title')
      })

      it('skip', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child'
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const skip = node => node.get('uid') === uid1
        const newTree = Tree2.doActionAll(tree, action, skip)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        expect(tree.nodes[0].title).toEqual('1st child')
        // new value
        expect(newTree.title).toEqual('new title')
        // new value skipped
        expect(newTree.nodes[0].title).toEqual('1st child')
      })

      it('skip all', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child'
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const skip = () => true
        const newTree = Tree2.doActionAll(tree, action, skip)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        expect(tree.nodes[0].title).toEqual('1st child')
        // new value skipped
        expect(newTree.title).toEqual('Mr. Foo')
        expect(newTree.nodes[0].title).toEqual('1st child')
      })
    })

    describe('2nd generation', () => {

      it('action', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child',
              nodes: [
                {
                  uid: uid2,
                  title: '1st grandchild'
                },
                {
                  uid: uid3,
                  title: '2nd grandchild'
                }
              ]
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doActionAll(tree, action)
        // immutable
        expect(tree.nodes[0].nodes[0].title).toEqual('1st grandchild')
        expect(tree.nodes[0].nodes[1].title).toEqual('2nd grandchild')
        // new value
        expect(newTree.nodes[0].nodes[0].title).toEqual('new title')
        expect(newTree.nodes[0].nodes[1].title).toEqual('new title')
      })

      it('action', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child',
              nodes: [
                {
                  uid: uid2,
                  title: '1st grandchild'
                },
                {
                  uid: uid3,
                  title: '2nd grandchild'
                }
              ]
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const skip = node => node.get('uid') === uid2
        const newTree = Tree2.doActionAll(tree, action, skip)
        // immutable
        expect(tree.nodes[0].nodes[0].title).toEqual('1st grandchild')
        expect(tree.nodes[0].nodes[1].title).toEqual('2nd grandchild')
        // new value skipped
        expect(newTree.nodes[0].nodes[0].title).toEqual('1st grandchild')
        expect(newTree.nodes[0].nodes[1].title).toEqual('new title')
      })

      it('skip all', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [
            {
              uid: uid1,
              title: '1st child',
              nodes: [
                {
                  uid: uid2,
                  title: '1st grandchild'
                },
                {
                  uid: uid3,
                  title: '2nd grandchild'
                }
              ]
            }
          ]
        }
        const action = node => node.set('title', 'new title')
        const skip = () => true
        const newTree = Tree2.doActionAll(tree, action, skip)
        // new value skipped
        expect(newTree.nodes[0].nodes[0].title).toEqual('1st grandchild')
        expect(newTree.nodes[0].nodes[1].title).toEqual('2nd grandchild')
      })
    })
  })

  describe('getNextChildIndex', () => {

    it('no nodes', () => {
      const nodeMap = fromJS({ uid })
      expect(Tree2.getNextChildIndex(nodeMap, uid1)).toBe(null)
    })

    it('not in nodes', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1 }] })
      expect(Tree2.getNextChildIndex(nodeMap, uid2)).toBe(null)
    })

    it('in nodes', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1 }, { uid: uid2 }] })
      expect(Tree2.getNextChildIndex(nodeMap, uid2)).toBe(1)
    })
  })

  describe('getPathIndexes', () => {

    it('not root', () => {
      const nodeMap = fromJS({ uid })
      expect(Tree2.getPathIndexes(nodeMap, [uid1])).toBe(null)
    })

    it('root', () => {
      const nodeMap = fromJS({ uid })
      expect(Tree2.getPathIndexes(nodeMap, [uid])).toEqual([])
    })

    it('non 1st child', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1 }] })
      expect(Tree2.getPathIndexes(nodeMap, [uid, uid2])).toBe(null)
    })

    it('1st child', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1 }, { uid: uid2 }] })
      expect(Tree2.getPathIndexes(nodeMap, [uid, uid2])).toEqual([1])
    })

    it('non nodes 2nd child', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1 }] })
      expect(Tree2.getPathIndexes(nodeMap, [uid, uid1, uid3])).toBe(null)
    })

    it('non 2nd child', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1, nodes: [{ uid: uid2 }] }] })
      expect(Tree2.getPathIndexes(nodeMap, [uid, uid1, uid3])).toBe(null)
    })

    it('2nd child', () => {
      const nodeMap = fromJS({ uid, nodes: [{ uid: uid1, nodes: [{ uid: uid2 }, { uid: uid3 }] }] })
      expect(Tree2.getPathIndexes(nodeMap, [uid, uid1, uid3])).toEqual([0, 1])
    })
  })

  describe('includeNodesKeyInPathIndexes', () => {

    it('root', () => {
      expect(Tree2.includeNodesKeyInPathIndexes([])).toEqual([])
    })

    it('indexes', () => {
      expect(Tree2.includeNodesKeyInPathIndexes([0, 1])).toEqual(['nodes', 0, 'nodes', 1])
    })
  })

  describe('doAction', () => {

    describe('root', () => {

      it('action', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const path = [uid]
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doAction(tree, path, action)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        // new value
        expect(newTree.title).toEqual('new title')
      })
    })

    describe('1st generation', () => {

      it('action', () => {
        const tree = { uid, title: 'Mr. Foo', nodes: [{ uid: uid1, title: 'First child' }] }
        const path = [uid, uid1]
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doAction(tree, path, action)
        // immutable
        expect(tree.nodes[0].title).toEqual('First child')
        // new value
        expect(newTree.nodes[0].title).toEqual('new title')
      })
    })

    describe('2nd generation', () => {

      it('action', () => {
        const tree = {
          uid,
          title: 'Mr. Foo',
          nodes: [{
            uid: uid1,
            title: 'First child',
            nodes: [
              {
                uid: uid2,
                title: 'First grandchild'
              },
              {
                uid: uid3,
                title: 'Second grandchild'
              }
            ]
          }]
        }
        const path = [uid, uid1, uid3]
        const action = node => node.set('title', 'new title')
        const newTree = Tree2.doAction(tree, path, action)
        // immutable
        expect(tree.nodes[0].nodes[1].title).toEqual('Second grandchild')
        // new value
        expect(newTree.nodes[0].nodes[1].title).toEqual('new title')
      })
    })
  })

  // @TODO
  // path as array
  // skip by path
  // path to indexPath
  // action remove
  // action add sibling after
  // abort after number of non skipped
  // breath first, depth first
  // skip generations
  // skip branch
})
