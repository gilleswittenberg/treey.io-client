import Tree2 from '../../app/lib/Tree2'
import { fromJS } from 'immutable'
import { updateNode, createNode, addNode, removeNode } from '../../app/lib/TreeActions'

describe('Tree2', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'
  const uid4 = '57bedc40e81b0620300d7694'

  describe('doActionAll', () => {

    describe('root', () => {

      it('action', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const action = node => {
          node.title = 'new title'
          return node
        }
        const newTree = Tree2.doActionAll(tree, action)
        // immutable
        expect(tree.title).toEqual('Mr. Foo')
        // new value
        expect(newTree.title).toEqual('new title')
      })

      it('skip', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const action = node => {
          node.title = 'new title'
          return node
        }
        const skip = node => node.uid === uid
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
        const action = node => {
          node.title = 'new title'
          return node
        }
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
        const action = node => {
          node.title = 'new title'
          return node
        }
        const skip = node => node.uid === uid1
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
        const action = node => {
          node.title = 'new title'
          return node
        }
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
        const action = node => {
          node.title = 'new title'
          return node
        }
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
        const action = node => {
          node.title = 'new title'
          return node
        }
        const skip = node => node.uid === uid2
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
        const action = node => {
          node.title = 'new title'
          return node
        }
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

  describe('find', () => {

    describe('property', () => {

      it('root false', () => {
        const tree = {
          active: true
        }
        expect(Tree2.find(tree)).toEqual([])
      })

      it('root', () => {
        const tree = {
          active: true
        }
        expect(Tree2.find(tree, node => node.active)).toEqual([tree])
      })

      it('first generation', () => {
        const tree = {
          nodes: [
            { uid: uid1, active: true },
            { uid: uid2, active: false },
            { uid: uid3, active: true }
          ]
        }
        expect(Tree2.find(tree, node => node.active)).toEqual([{ uid: uid1, active: true }, { uid: uid3, active: true }])
      })

      it('2nd generation', () => {
        const tree = {
          nodes: [
            { uid: uid1, active: true },
            {
              uid: uid2,
              active: false,
              nodes: [
                { uid: uid3, active: false },
                { uid: uid4, active: true }
              ]
            }
          ]
        }
        expect(Tree2.find(tree, node => node.active)).toEqual([{ uid: uid1, active: true }, { uid: uid4, active: true }])
      })
    })

    describe('parent', () => {

      it('root', () => {
        const tree = {
          uid,
          nodes: [
            { uid: uid1 },
            { uid: uid2 },
            { uid: uid3 }
          ]
        }
        expect(Tree2.find(tree, (node, parent) => parent && parent.uid === uid)).toEqual([
          { uid: uid1 }, { uid: uid2 }, { uid: uid3 }
        ])
      })
    })

    describe('parent, sibling', () => {

      it('root', () => {
        const tree = {
          uid,
          nodes: [
            { uid: uid1 },
            { uid: uid2 },
            { uid: uid3 }
          ]
        }
        expect(Tree2.find(tree, (node, parent, siblings, index) => {
          if (!parent || parent.uid !== uid) return false
          const prevSibling = siblings[index - 1]
          if (!prevSibling || prevSibling.uid !== uid1) return false
          return true
        })).toEqual([{ uid: uid2 }])
      })
    })
  })

  describe('doAction', () => {

    describe('root', () => {

      it('action', () => {
        const tree = { uid, title: 'Mr. Foo' }
        const path = [uid]
        const action = node => {
          node.title = 'new title'
          return node
        }
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
        const action = node => {
          node.title = 'new title'
          return node
        }
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
        const action = node => {
          node.title = 'new title'
          return node
        }
        const newTree = Tree2.doAction(tree, path, action)
        // immutable
        expect(tree.nodes[0].nodes[1].title).toEqual('Second grandchild')
        // new value
        expect(newTree.nodes[0].nodes[1].title).toEqual('new title')
      })
    })

    describe('TreeActions', () => {

      describe('updateNode', () => {

        it('root', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            }
          }
          const path = [uid]
          const data = { title: 'new title' }
          const newTree = Tree2.doAction(tree, path, updateNode(data))
          // immutable
          expect(tree.data.title).toEqual('Mr. Foo')
          // new value
          expect(newTree.data.title).toEqual('new title')
        })

        it('1st generation', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              }
            }]
          }
          const path = [uid, uid1]
          const data = { title: 'new title' }
          const newTree = Tree2.doAction(tree, path, updateNode(data))
          // immutable
          expect(tree.nodes[0].data.title).toEqual('First child')
          // new value
          expect(newTree.nodes[0].data.title).toEqual('new title')
        })

        it('2nd generation', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              },
              nodes: [
                {
                  uid: uid2,
                  data: {
                    title: 'First grandchild'
                  }
                },
                {
                  uid: uid3,
                  data: {
                    title: 'Second grandchild'
                  }
                }
              ]
            }]
          }
          const path = [uid, uid1, uid3]
          const data = { title: 'new title' }
          const newTree = Tree2.doAction(tree, path, updateNode(data))
          // immutable
          expect(tree.nodes[0].nodes[1].data.title).toEqual('Second grandchild')
          // new value
          expect(newTree.nodes[0].nodes[1].data.title).toEqual('new title')
        })
      })

      describe('addNode', () => {

        it('root', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            }
          }
          const path = [uid]
          const node = { uid: uid1, data: { title: 'new node' } }
          const newTree = Tree2.doAction(tree, path, addNode(node))
          // immutable
          expect(tree.nodes).toBe(undefined)
          // new value
          expect(newTree.nodes.length).toBe(1)
          expect(newTree.nodes[0]).toEqual(node)
        })

        it('root before', () => {

          const nodes = [{
            uid: uid1,
            data: {
              title: 'First child'
            }
          }]
          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes
          }
          const path = [uid]
          const node = { uid: uid2, data: { title: 'new node' } }
          const newTree = Tree2.doAction(tree, path, addNode(node, uid1))
          // immutable
          expect(tree.nodes).toBe(nodes)
          // new value
          expect(newTree.nodes.length).toBe(2)
          expect(newTree.nodes[0]).toEqual(node)
        })

        it('1st generation before', () => {
          const nodes = [{
            uid: uid2,
            path: [uid, uid1, uid2],
            data: {
              title: 'First grandchild'
            }
          }]

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              },
              nodes
            }]
          }
          const path = [uid, uid1]
          const node = { uid: uid3, data: { title: 'new node' } }
          const newTree = Tree2.doAction(tree, path, addNode(node, uid2))
          // immutable
          expect(tree.nodes[0].nodes).toBe(nodes)
          // new value
          expect(newTree.nodes[0].nodes.length).toBe(2)
          expect(newTree.nodes[0].nodes[0]).toEqual(node)
        })
      })

      describe('removeNode', () => {

        it('1st generation', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              }
            }]
          }
          const path = [uid]
          const newTree = Tree2.doAction(tree, path, removeNode(uid1))
          // immutable
          expect(tree.nodes.length).toBe(1)
          // new value
          expect(newTree.nodes.length).toBe(0)
        })

        it('1st generation non existing', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              }
            }]
          }
          const path = [uid]
          const newTree = Tree2.doAction(tree, path, removeNode(uid2))
          // immutable
          expect(tree.nodes.length).toBe(1)
          // new value
          expect(newTree.nodes.length).toBe(1)
        })
      })

      describe('createNode, addNode', () => {

        it('1st generation before', () => {

          const data = {
            title: 'new node'
          }

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [{
              uid: uid1,
              path: [uid, uid1],
              data: {
                title: 'First child'
              }
            }]
          }
          const path = [uid, uid1]
          const newTree = Tree2.doAction(tree, path, createNode(data), addNode(uid2))
          // new value
          expect(newTree.nodes[0].nodes.length).toBe(1)
          expect(newTree.nodes[0].nodes[0].data.title).toBe('new node')
          expect(newTree.nodes[0].nodes[0].path).toEqual([uid, uid1, null])
        })
      })

      // @TODO: Allow chaining removeNode, createNode with different paths
      describe('moveNode', () => {

        it('1st generation', () => {

          const tree = {
            uid,
            path: [uid],
            data: {
              title: 'Mr. Foo'
            },
            nodes: [
              {
                uid: uid1,
                path: [uid, uid1],
                data: {
                  title: 'First child'
                }
              },
              {
                uid: uid2,
                path: [uid, uid2],
                data: {
                  title: 'Second child'
                }
              }
            ]
          }
          const node = Tree2.getNode(tree, [uid, uid1])
          let newTree
          newTree = Tree2.doAction(tree, [uid], removeNode(uid1))
          newTree = Tree2.doAction(newTree, [uid], addNode(node))
          // new value
          expect(newTree.nodes.length).toBe(2)
          expect(newTree.nodes[0].data.title).toBe('Second child')
          expect(newTree.nodes[1].data.title).toBe('First child')
        })
      })
    })
  })
})
