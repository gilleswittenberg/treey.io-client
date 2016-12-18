/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import type { TreeNode } from '../../../flow/tree'

import {
  treeIndexPathToTreeNodesPath,
  getNodesIndex,
  getTreeIndexPath,
  getUidFromPath,
  getParentFromPath,
  getTreeNode,
  parseTree,
  findTreePath,
  filterTree,
  flattenTree,
  mapTree
} from '../../../app/lib/tree/TreeUtils'
import { createNode } from '../../../app/lib/tree/NodeModifiers'
import { createTreeNode, updateTreeNode } from '../../../app/lib/tree/TreeNodeModifiers'
import defaultUI from '../../../app/lib/ui/defaultUI'
import { uid, uid1, uid2, uid3, uid4, uid5, uid6 } from '../../uid'
import { isVisible } from '../../../app/lib/tree/TreeOperations'

describe('TreeUtils', () => {

  describe('treeIndexPathToTreeNodesPath', () => {

    it('empty', () => {
      const path = []
      expect(treeIndexPathToTreeNodesPath(path, 'nodes')).toEqual([])
    })

    it('1 generation', () => {
      const path = [1]
      expect(treeIndexPathToTreeNodesPath(path, 'nodes')).toEqual(['nodes', 1])
    })

    it('2 generations', () => {
      const path = [4, 0]
      expect(treeIndexPathToTreeNodesPath(path, 'nodes')).toEqual(['nodes', 4, 'nodes', 0])
    })

    it('append nodes key', () => {
      const path = [0]
      expect(treeIndexPathToTreeNodesPath(path, 'nodes', true)).toEqual(['nodes', 0, 'nodes'])
    })

    it('immutable path', () => {
      const path = [1, 3]
      treeIndexPathToTreeNodesPath(path, 'nodes', true)
      expect(path).toEqual([1, 3])
    })
  })

  describe('getNodesIndex', () => {

    it('empty array', () => {
      const nodes = []
      expect(getNodesIndex(nodes, uid, 'uid')).toBe(null)
    })

    it('not in nodes', () => {
      const nodes = [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }]
      expect(getNodesIndex(nodes, uid1, 'uid')).toBe(null)
    })

    it('in nodes', () => {
      const nodes = [{
        node: { uid: uid1, data: { title: '' }, ui: defaultUI },
        path: [uid1],
        nodes: []
      }, {
        node: { uid: uid2, data: { title: '' }, ui: defaultUI },
        path: [uid2],
        nodes: []
      }]
      expect(getNodesIndex(nodes, uid2, 'uid')).toBe(1)
    })
  })

  describe('getTreeIndexPath', () => {

    it('empty root', () => {
      const node = { nodes: [] }
      expect(getTreeIndexPath(node, [], 'nodes', 'uid')).toEqual([])
    })

    it('not in root nodes', () => {
      const node = { nodes: [{
        node: {
          uid,
          data: { title: '' },
          ui: defaultUI
        },
        path: [uid],
        nodes: []
      }] }
      expect(getTreeIndexPath(node, [uid1], 'nodes', 'uid')).toBe(null)
    })

    it('root nodes', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      expect(getTreeIndexPath(node, [uid], 'nodes', 'uid')).toEqual([0])
    })

    it('non 1st child', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid1]
        }]
      }] }
      expect(getTreeIndexPath(node, [uid, uid2], 'nodes', 'uid')).toBe(null)
    })

    it('1st child', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid1]
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid2]
        }]
      }] }
      expect(getTreeIndexPath(node, [uid, uid2], 'nodes', 'uid')).toEqual([0, 1])
    })

    it('non nodes 2nd child', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid1]
        }]
      }] }
      expect(getTreeIndexPath(node, [uid, uid1, uid3], 'nodes', 'uid')).toBe(null)
    })

    it('non 2nd child', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid1]
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          nodes: [],
          path: [uid, uid2]
        }]
      }] }
      expect(getTreeIndexPath(node, [uid, uid1, uid3], 'nodes', 'uid')).toBe(null)
    })

    it('2nd child', () => {
      const node = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          nodes: [{
            node: { uid: uid2, data: { title: '' }, ui: defaultUI },
            nodes: [],
            path: [uid, uid2]
          }, {
            node: { uid: uid3, data: { title: '' }, ui: defaultUI },
            nodes: [],
            path: [uid, uid3]
          }],
          path: [uid, uid1]
        }]
      }] }
      expect(getTreeIndexPath(node, [uid, uid1, uid3], 'nodes', 'uid')).toEqual([0, 0, 1])
    })
  })

  describe('getUidFromPath', () => {

    it('null', () => {
      expect(getUidFromPath(null)).toEqual(null)
    })

    it('empty array', () => {
      expect(getUidFromPath([])).toEqual(null)
    })

    it('array length 1', () => {
      expect(getUidFromPath([uid])).toEqual(uid)
    })

    it('array', () => {
      expect(getUidFromPath([uid, uid1, uid2])).toEqual(uid2)
    })
  })

  describe('getParentFromPath', () => {

    it('null', () => {
      expect(getParentFromPath(null)).toEqual(null)
    })

    it('empty array', () => {
      expect(getParentFromPath([])).toEqual(null)
    })

    it('array length 1', () => {
      expect(getParentFromPath([uid])).toEqual(null)
    })

    it('array', () => {
      expect(getParentFromPath([uid, uid1, uid2])).toEqual(uid1)
    })
  })

  describe('getTreeNode', () => {

    it('root', () => {
      const node = createNode(uid)
      const treeNode = createTreeNode(node)
      const treeData = { nodes: [treeNode] }
      const path = [uid]
      expect(getTreeNode(treeData, path, 'nodes', 'uid')).toEqual(treeNode)
    })

    it('first generation', () => {
      const node = createNode(uid1)
      const treeNode = createTreeNode(node)
      const treeData = { nodes: [
        {
          node: {
            uid,
            data: { title: '' },
            ui: defaultUI
          },
          path: [uid],
          nodes: [treeNode]
        }
      ] }
      const path = [uid, uid1]
      expect(getTreeNode(treeData, path, 'nodes', 'uid')).toEqual(treeNode)
    })
  })

  describe('parseTree', () => {

    it('root', () => {
      const tree = { uid, title: 'Mr. Foo' }
      const parsedTree = parseTree(tree)
      expect(parsedTree.nodes.length).toBe(1)
      expect(parsedTree.nodes[0].path).toEqual([uid])
      expect(parsedTree.nodes[0].nodes).toEqual([])
      expect(parsedTree.nodes[0].node.uid).toBe(uid)
      expect(parsedTree.nodes[0].node.data).toEqual({ title: 'Mr. Foo' })
    })

    it('1st generation', () => {
      const nodes = [{ uid: uid1, title: 'First child' }, { uid: uid2, title: 'Second child' }]
      const tree = { uid, title: 'Mr. Foo', nodes }
      const parsedTree = parseTree(tree)
      expect(parsedTree.nodes[0].nodes.length).toBe(2)
      expect(parsedTree.nodes[0].nodes[0].path).toEqual([uid, uid1])
      expect(parsedTree.nodes[0].nodes[0].node.uid).toBe(uid1)
      expect(parsedTree.nodes[0].nodes[0].node.data).toEqual({ title: 'First child' })
      expect(parsedTree.nodes[0].nodes[1].path).toEqual([uid, uid2])
      expect(parsedTree.nodes[0].nodes[1].node.uid).toBe(uid2)
      expect(parsedTree.nodes[0].nodes[1].node.data).toEqual({ title: 'Second child' })
    })

    it('2nd generation', () => {
      const nodes = [{ uid: uid2, title: 'First grandchild' }, { uid: uid3, title: 'Second grandchild' }]
      const tree = {
        uid,
        title: 'Mr. Foo',
        nodes : [
          { uid: uid4, title: 'First child' },
          { uid: uid1, title: 'Second child', nodes }
        ]
      }
      const parsedTree = parseTree(tree)
      expect(parsedTree.nodes[0].nodes[1].nodes.length).toBe(2)
      expect(parsedTree.nodes[0].nodes[1].nodes[0].path).toEqual([uid, uid1, uid2])
      expect(parsedTree.nodes[0].nodes[1].nodes[0].node.uid).toBe(uid2)
      expect(parsedTree.nodes[0].nodes[1].nodes[0].node.data).toEqual({ title: 'First grandchild' })
      expect(parsedTree.nodes[0].nodes[1].nodes[1].path).toEqual([uid, uid1, uid3])
      expect(parsedTree.nodes[0].nodes[1].nodes[1].node.uid).toBe(uid3)
      expect(parsedTree.nodes[0].nodes[1].nodes[1].node.data).toEqual({ title: 'Second grandchild' })
    })
  })

  describe('findTreePath', () => {


    it('non existing', () => {
      const tree = { nodes: [] }
      const search = (node: TreeNode) => (node && node.node && node.node.uid === uid) || false
      expect(findTreePath(tree, search, 'nodes', 'uid')).toBe(null)
    })

    it('root', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      const search = (node: TreeNode) => (node && node.node && node.node.uid === uid) || false
      expect(findTreePath(tree, search, 'nodes', 'uid')).toEqual([uid])
    })

    it('1st generation', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui:defaultUI },
          path: [uid, uid1],
          nodes: []
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          path: [uid, uid2],
          nodes: []
        }]
      }] }
      const search = (node: TreeNode) => (node && node.node && node.node.uid === uid2) || false
      expect(findTreePath(tree, search, 'nodes', 'uid')).toEqual([uid, uid2])
    })

    it('2nd generation', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          path: [uid, uid1],
          nodes: [{
            node: { uid: uid2, data: { title: '' }, ui: defaultUI },
            path: [uid, uid2],
            nodes: []
          }, {
            node: { uid: uid3, data: { title: '' }, ui: defaultUI },
            path: [uid, uid3],
            nodes: []
          }]
        }]
      }] }
      const search = (node: TreeNode) => (node && node.node && node.node.uid === uid3) || false
      expect(findTreePath(tree, search, 'nodes', 'uid')).toEqual([uid, uid1, uid3])
    })
  })

  describe('filterTree', () => {

    it('empty', () => {
      const tree = { nodes: [] }
      const search = () => false
      expect(filterTree(tree, undefined, search, 'nodes', 'uid')).toEqual({ nodes: [] })
    })

    it('non valid', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      const search = () => false
      expect(filterTree(tree, undefined, search, 'nodes', 'uid')).toEqual({ nodes: [] })
    })

    it('valid', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: 'Mr. Foo' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      const search = () => true
      const filteredTree = filterTree(tree, undefined, search, 'nodes', 'uid')
      expect(filteredTree.nodes[0].node.uid).toBe(uid)
      expect(filteredTree.nodes[0].node.data.title).toBe('Mr. Foo')
      expect(filteredTree.nodes[0].node.ui).toEqual(defaultUI)
    })

    it('valid multiple', () => {
      const tree = { nodes: [{
        node: { uid: uid1, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }, {
        node: { uid: uid2, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }, {
        node: { uid: uid3, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      const search = (node: any) => node.node.uid === uid1 || node.node.uid === uid3
      const filteredTree = filterTree(tree, undefined, search, 'nodes', 'uid')
      expect(filteredTree.nodes.length).toBe(2)
      expect(filteredTree.nodes[0].node.uid).toBe(uid1)
      expect(filteredTree.nodes[1].node.uid).toBe(uid3)
    })

    it('1 generation', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          path: [uid, uid1],
          nodes: []
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          path: [uid, uid2],
          nodes: []
        }, {
          node: { uid: uid3, data: { title: '' }, ui: defaultUI },
          path: [uid, uid3],
          nodes: []
        }] }
      ] }
      const search = (node: any) => node.node.uid === uid || node.node.uid === uid1 || node.node.uid === uid3
      const filteredTree = filterTree(tree, undefined, search, 'nodes', 'uid')
      expect(filteredTree.nodes[0].node.uid).toBe(uid)
      expect(filteredTree.nodes[0].nodes[0].node.uid).toBe(uid1)
      expect(filteredTree.nodes[0].nodes[1].node.uid).toBe(uid3)
    })

    it('2 generations', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          path: [uid, uid1],
          nodes: [{
            node: { uid: uid4, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1, uid4],
            nodes: []
          }, {
            node: { uid: uid5, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1, uid5],
            nodes: []
          }]
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          path: [uid, uid2],
          nodes: []
        }, {
          node: { uid: uid3, data: { title: '' }, ui: defaultUI },
          path: [uid, uid3],
          nodes: []
        }] }
      ] }
      const search = (node: any) => node.node.uid === uid || node.node.uid === uid1 || node.node.uid === uid3 || node.node.uid === uid5
      const filteredTree = filterTree(tree, undefined, search, 'nodes', 'uid')
      expect(filteredTree.nodes.length).toBe(1)
      expect(filteredTree.nodes[0].nodes.length).toBe(2)
      expect(filteredTree.nodes[0].nodes[0].nodes.length).toBe(1)
      expect(filteredTree.nodes[0].nodes[0].nodes[0].node.uid).toBe(uid5)
    })

    it('ui parent', () => {
      const uiExpanded = { ...defaultUI, expanded: true }
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: uiExpanded },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: uiExpanded },
          path: [uid, uid1],
          nodes: [{
            node: { uid: uid4, data: { title: '' }, ui: uiExpanded },
            path: [uid, uid1, uid4],
            nodes: []
          }, {
            node: { uid: uid5, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1, uid5],
            nodes: []
          }]
        }, {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          path: [uid, uid2],
          nodes: [{
            node: { uid: uid6, data: { title: '' }, ui: defaultUI },
            path: [uid, uid2, uid6],
            nodes: []
          }]
        }, {
          node: { uid: uid3, data: { title: '' }, ui: uiExpanded },
          path: [uid, uid3],
          nodes: []
        }] }
      ] }
      const filteredTree = filterTree(tree, undefined, isVisible, 'nodes', 'uid')
      expect(filteredTree.nodes.length).toBe(1)
      expect(filteredTree.nodes[0].nodes.length).toBe(3)
      expect(filteredTree.nodes[0].nodes[0].nodes.length).toBe(2)
      expect(filteredTree.nodes[0].nodes[0].nodes[0].node.uid).toBe(uid4)
      expect(filteredTree.nodes[0].nodes[0].nodes[1].node.uid).toBe(uid5)
    })
  })

  describe('flattenTree', () => {

    it('empty', () => {
      const tree = { nodes: [] }
      expect(flattenTree(tree, 'nodes')).toEqual([])
    })

    it('1 generation', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }, {
        node: { uid: uid1, data: { title: '' }, ui: defaultUI },
        path: [uid1],
        nodes: []
      }] }
      const flattenedTree = flattenTree(tree, 'nodes')
      expect(flattenedTree.length).toBe(2)
      expect(flattenedTree[0].node.uid).toBe(uid)
      expect(flattenedTree[1].node.uid).toBe(uid1)
    })

    it('2 generations', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid3, data: { title: '' }, ui: defaultUI },
          path: [uid, uid3],
          nodes: []
        }, {
          node: { uid: uid4, data: { title: '' }, ui: defaultUI },
          path: [uid, uid4],
          nodes: []
        }] },
        {
          node: { uid: uid2, data: { title: '' }, ui: defaultUI },
          path: [uid2],
          nodes: []
        }
      ] }
      const flattenedTree = flattenTree(tree, 'nodes')
      expect(flattenedTree.length).toBe(4)
      expect(flattenedTree[0].node.uid).toBe(uid)
      expect(flattenedTree[3].node.uid).toBe(uid2)
    })
  })

  describe('mapTree', () => {

    it('root', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: 'Mr. Foo' }, ui: defaultUI },
        path: [uid],
        nodes: []
      }] }
      const mapFn = node => {
        node.node.data.title = 'new'
        return node
      }
      const treeMapped = mapTree(tree, mapFn, 'nodes')
      expect(treeMapped.nodes[0].node.data).toEqual({ title: 'new' })
    })

    it('2 generations', () => {
      const tree = { nodes: [{
        node: { uid, data: { title: '' }, ui: defaultUI },
        path: [uid],
        nodes: [{
          node: { uid: uid1, data: { title: '' }, ui: defaultUI },
          path: [uid, uid1],
          nodes: [{
            node: { uid: uid2, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1, uid2],
            nodes: []
          }, {
            node: { uid: uid3, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1, uid3],
            nodes: []
          }]
        }]
      }] }
      const mapFunc = node => updateTreeNode(node, undefined, undefined, { editing: true })
      const treeMapped = mapTree(tree, mapFunc, 'nodes')
      expect(treeMapped.nodes[0].node.ui.editing).toBe(true)
      expect(treeMapped.nodes[0].nodes[0].node.ui.editing).toBe(true)
      expect(treeMapped.nodes[0].nodes[0].nodes[0].node.ui.editing).toBe(true)
      expect(treeMapped.nodes[0].nodes[0].nodes[1].node.ui.editing).toBe(true)
    })
  })
})
