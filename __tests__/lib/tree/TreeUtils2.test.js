/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import {
  updateNodeAtIndexPath,
  updateAllNodes
} from '../../../app/lib/tree/TreeUtils2'

describe('TreeUtils2', () => {

  describe('updateNodeAtIndexPath', () => {

    it('non existing', () => {
      const tree = { nodes: [{ key: 'value' }] }
      const updatedTree = updateNodeAtIndexPath(tree, 'nodes', [1], 'key', 'new value')
      expect(updatedTree).toEqual(tree)
    })

    it('root', () => {
      const tree = { nodes: [{ key: 'value' }] }
      const updatedTree = updateNodeAtIndexPath(tree, 'nodes', [0], 'key', 'new value')
      expect(updatedTree.nodes[0].key).toBe('new value')
    })

    it('deep', () => {
      const tree = { nodes: [
        {
          key: 'value',
          nodes: [
            {
              key: 'child 0 value'
            },
            {
              key: 'child 1 value'
            }
          ]
        }
      ] }
      const updatedTree = updateNodeAtIndexPath(tree, 'nodes', [0, 1], 'key', 'new value')
      expect(updatedTree.nodes[0].nodes[1].key).toBe('new value')
    })

    it('nested key', () => {
      const tree = { nodes: [{ key: { key2: 'value' } }] }
      const updatedTree = updateNodeAtIndexPath(tree, 'nodes', [0], 'key.key2', 'new value')
      expect(updatedTree.nodes[0].key.key2).toBe('new value')
    })
  })

  describe('updateAllNodes', () => {

    it('empty', () => {
      const tree = { nodes: [] }
      const updatedTree = updateAllNodes(tree, 'nodes', 'key', 'new value')
      expect(updatedTree).toEqual(tree)
    })

    it('root', () => {
      const tree = { nodes: [{ key: 'value' }] }
      const updatedTree = updateAllNodes(tree, 'nodes', 'key', 'new value')
      expect(updatedTree.nodes[0].key).toBe('new value')
    })

    it('deep', () => {
      const tree = { nodes: [
        {
          key: 'value',
          nodes: [
            {
              key: 'child 0 value'
            },
            {
              key: 'child 1 value'
            }
          ]
        }
      ] }
      const updatedTree = updateAllNodes(tree, 'nodes', 'key', 'new value')
      expect(updatedTree.nodes[0].key).toBe('new value')
      expect(updatedTree.nodes[0].nodes[0].key).toBe('new value')
      expect(updatedTree.nodes[0].nodes[1].key).toBe('new value')
    })

    it('nested key', () => {
      const tree = { nodes: [{ key: { key2: 'value' } }] }
      const updatedTree = updateAllNodes(tree, 'nodes', 'key.key2', 'new value')
      expect(updatedTree.nodes[0].key.key2).toBe('new value')
    })
  })
})
