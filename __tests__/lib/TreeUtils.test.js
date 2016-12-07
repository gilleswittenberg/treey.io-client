/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { pathToNodesPath, getNodesIndex, getPathIndexes, parse, find, filter, flatten, map } from '../../app/lib/TreeUtils'
import * as nodeModifiers from '../../app/lib/NodeModifiers'
const { parse: parseNode } = nodeModifiers
import defaultUI from '../../app/lib/defaultUI'

describe('TreeUtils', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'
  const uid4 = '57bedc40e81b0620300d7694'
  const uid5 = '57bedc40e81b0620300d7695'
  const uid6 = '57bedc40e81b0620300d7696'

  describe('pathToNodesPath', () => {

    it('empty', () => {
      const path = []
      expect(pathToNodesPath(path, 'nodes')).toEqual([])
    })

    it('1 generation', () => {
      const path = [1]
      expect(pathToNodesPath(path, 'nodes')).toEqual(['nodes', 1])
    })

    it('2 generations', () => {
      const path = [4, 0]
      expect(pathToNodesPath(path, 'nodes')).toEqual(['nodes', 4, 'nodes', 0])
    })

    it('append nodes key', () => {
      const path = [0]
      expect(pathToNodesPath(path, 'nodes', true)).toEqual(['nodes', 0, 'nodes'])
    })

    it('immutable path', () => {
      const path = [1, 3]
      pathToNodesPath(path, 'nodes', true)
      expect(path).toEqual([1, 3])
    })
  })

  describe('getNodesIndex', () => {

    it('empty array', () => {
      const nodes = []
      expect(getNodesIndex(nodes, uid, 'uid')).toBe(null)
    })

    it('not in nodes', () => {
      const nodes = [{ uid, nodes: [] }]
      expect(getNodesIndex(nodes, uid1, 'uid')).toBe(null)
    })

    it('in nodes', () => {
      const nodes = [{ uid: uid1, nodes: [] }, { uid: uid2, nodes: [] }]
      expect(getNodesIndex(nodes, uid2, 'uid')).toBe(1)
    })
  })

  describe('getPathIndexes', () => {

    it('empty root', () => {
      const node = { nodes: [] }
      expect(getPathIndexes(node, [], 'nodes', 'uid')).toEqual([])
    })

    it('not in root nodes', () => {
      const node = { nodes: [{ uid, nodes: [] }] }
      expect(getPathIndexes(node, [uid1], 'nodes', 'uid')).toBe(null)
    })

    it('root nodes', () => {
      const node = { nodes: [{ uid, nodes: [] }] }
      expect(getPathIndexes(node, [uid], 'nodes', 'uid')).toEqual([0])
    })

    it('non 1st child', () => {
      const node = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }] }] }
      expect(getPathIndexes(node, [uid, uid2], 'nodes', 'uid')).toBe(null)
    })

    it('1st child', () => {
      const node = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }, { uid: uid2, nodes: [] }] }] }
      expect(getPathIndexes(node, [uid, uid2], 'nodes', 'uid')).toEqual([0, 1])
    })

    it('non nodes 2nd child', () => {
      const node = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }] }] }
      expect(getPathIndexes(node, [uid, uid1, uid3], 'nodes', 'uid')).toBe(null)
    })

    it('non 2nd child', () => {
      const node = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [{ uid: uid2, nodes: [] }] }] }] }
      expect(getPathIndexes(node, [uid, uid1, uid3], 'nodes', 'uid')).toBe(null)
    })

    it('2nd child', () => {
      const node = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [{ uid: uid2, nodes: [] }, { uid: uid3, nodes: [] }] }] }] }
      expect(getPathIndexes(node, [uid, uid1, uid3], 'nodes', 'uid')).toEqual([0, 0, 1])
    })
  })

  describe('parse', () => {

    it('root', () => {
      const tree = { uid, title: 'Mr. Foo' }
      const parsedTree = parse(tree, parseNode, 'nodes', 'uid')
      expect(parsedTree.nodes.length).toBe(1)
      expect(parsedTree.nodes[0].uid).toBe(uid)
      expect(parsedTree.nodes[0].path).toEqual([uid])
      expect(parsedTree.nodes[0].data).toEqual({ title: 'Mr. Foo' })
      expect(parsedTree.nodes[0].nodes).toEqual([])
    })

    it('1st generation', () => {
      const nodes = [{ uid: uid1, title: 'First child' }, { uid: uid2, title: 'Second child' }]
      const tree = { uid, title: 'Mr. Foo', nodes }
      const parsedTree = parse(tree, parseNode, 'nodes', 'uid')
      expect(parsedTree.nodes[0].nodes.length).toBe(2)
      expect(parsedTree.nodes[0].nodes[0].uid).toBe(uid1)
      expect(parsedTree.nodes[0].nodes[0].data).toEqual({ title: 'First child' })
      expect(parsedTree.nodes[0].nodes[1].uid).toBe(uid2)
      expect(parsedTree.nodes[0].nodes[1].data).toEqual({ title: 'Second child' })
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
      const parsedTree = parse(tree, parseNode, 'nodes', 'uid')
      expect(parsedTree.nodes[0].nodes[1].nodes.length).toBe(2)
      expect(parsedTree.nodes[0].nodes[1].nodes[0].uid).toBe(uid2)
      expect(parsedTree.nodes[0].nodes[1].nodes[0].data).toEqual({ title: 'First grandchild' })
      expect(parsedTree.nodes[0].nodes[1].nodes[1].uid).toBe(uid3)
      expect(parsedTree.nodes[0].nodes[1].nodes[1].data).toEqual({ title: 'Second grandchild' })
    })
  })

  describe('find', () => {

    it('non existing', () => {
      const tree = { nodes: [] }
      const search = (node: any) => node.uid === uid
      expect(find(tree, search, 'nodes', 'uid')).toBe(null)
    })

    it('root', () => {
      const tree = { nodes: [{ uid, nodes: [] }] }
      const search = (node: any) => node.uid === uid
      expect(find(tree, search, 'nodes', 'uid')).toEqual([uid])
    })

    it('1st generation', () => {
      const tree = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [] }, { uid: uid2, nodes: [] }] }] }
      const search = (node: any) => node.uid === uid2
      expect(find(tree, search, 'nodes', 'uid')).toEqual([uid, uid2])
    })

    it('2nd generation', () => {
      const tree = { nodes: [{ uid, nodes: [{ uid: uid1, nodes: [{ uid: uid2, nodes: [] }, { uid: uid3, nodes: [] }] }] }] }
      const search = (node: any) => node.uid === uid3
      expect(find(tree, search, 'nodes', 'uid')).toEqual([uid, uid1, uid3])
    })
  })

  describe('filter', () => {

    it('empty', () => {
      const tree = { nodes: [] }
      const search = () => false
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [] })
    })

    it('non valid', () => {
      const tree = { nodes: [{ uid, nodes: [] }] }
      const search = () => false
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [] })
    })

    it('valid', () => {
      const tree = { nodes: [{ uid, nodes: [] }] }
      const search = () => true
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [{ uid, nodes: [] }] })
    })

    it('valid multiple', () => {
      const tree = { nodes: [
        { uid: uid1, nodes: [] },
        { uid: uid2, nodes: [] },
        { uid: uid3, nodes: [] }
      ] }
      const search = (node: any) => node.uid === uid1 || node.uid === uid3
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [
        { uid: uid1, nodes: [] },
        { uid: uid3, nodes: [] }
      ] })
    })

    it('1 generation', () => {
      const tree = { nodes: [
        { uid, nodes: [
          { uid: uid1, nodes: [] },
          { uid: uid2, nodes: [] },
          { uid: uid3, nodes: [] }
        ] }
      ] }
      const search = (node: any) => node.uid === uid || node.uid === uid1 || node.uid === uid3
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [
        { uid, nodes: [
          { uid: uid1, nodes: [] },
          { uid: uid3, nodes: [] }
        ] }
      ] })
    })

    it('2 generations', () => {
      const tree = { nodes: [
        { uid, nodes: [
          { uid: uid1, nodes: [
            { uid: uid4, nodes: [] },
            { uid: uid5, nodes: [] }
          ] },
          { uid: uid2, nodes: [] },
          { uid: uid3, nodes: [] }
        ] }
      ] }
      const search = (node: any) => node.uid === uid || node.uid === uid1 || node.uid === uid3 || node.uid === uid5
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [
        { uid, nodes: [
          { uid: uid1, nodes: [
            { uid: uid5, nodes: [] }
          ] },
          { uid: uid3, nodes: [] }
        ] }
      ] })
    })

    it('ui parent', () => {
      const uiExpanded = { ...defaultUI, expanded: true }
      const tree = { nodes: [
        { uid, ui: uiExpanded, nodes: [
          { uid: uid1, ui: uiExpanded, nodes: [
            { uid: uid4, ui: uiExpanded, nodes: [] },
            { uid: uid5, nodes: [] }
          ] },
          { uid: uid2, nodes: [
            { uid: uid6, nodes: [] }
          ] },
          { uid: uid3, ui: uiExpanded, nodes: [] }
        ] }
      ] }
      const search = (node: any, parent: any) => {
        if (parent && parent.ui && parent.ui.expanded === true) return true
        if (node && node.ui && node.ui.expanded === true) return true
        return false
      }
      expect(filter(tree, null, search, 'nodes', 'uid')).toEqual({ nodes: [
        { uid, ui: uiExpanded, nodes: [
          { uid: uid1, ui: uiExpanded, nodes: [
            { uid: uid4, ui: uiExpanded, nodes: [] },
            { uid: uid5, nodes: [] }
          ] },
          { uid: uid2, nodes: [] },
          { uid: uid3, ui: uiExpanded, nodes: [] }
        ] }
      ] })
    })
  })

  describe('flatten', () => {

    it('empty', () => {
      const tree = { nodes: [] }
      expect(flatten(tree, 'nodes')).toEqual([])
    })

    it('1 generation', () => {
      const tree = { nodes: [{ uid, nodes: [] }, { uid: uid2, nodes: [] }] }
      expect(flatten(tree, 'nodes')).toEqual([{ uid, nodes: [] }, { uid: uid2, nodes: [] }])
    })

    it('2 generations', () => {
      const tree = { nodes: [
        { uid, nodes: [
          { uid: uid3, nodes: [] },
          { uid: uid4, nodes: [] }
        ] },
        { uid: uid2, nodes: [] }
      ] }
      expect(flatten(tree, 'nodes')).toEqual([
        { uid, nodes: [
          { uid: uid3, nodes: [] },
          { uid: uid4, nodes: [] }
        ] },
        { uid: uid3, nodes: [] },
        { uid: uid4, nodes: [] },
        { uid: uid2, nodes: [] }
      ])
    })
  })

  describe('map', () => {

    it('root', () => {
      const tree = { nodes: [{ uid, nodes: [], data: { title: 'Mr. Foo' } }] }
      const mapFn = node => {
        node.data.title = 'new'
        return node
      }
      const treeMapped = map(tree, mapFn, 'nodes')
      expect(treeMapped.nodes[0].data).toEqual({ title: 'new' })
    })

    it('2 generations', () => {
      const tree = { nodes: [
        { uid, nodes: [
          { uid: uid1, nodes: [
            { uid: uid2, nodes: [] },
            { uid: uid3, nodes: [] }
          ]
        }]
      }] }
      const mapFn = node => {
        node.ui = { editing: true }
        return node
      }
      const treeMapped = map(tree, mapFn, 'nodes')
      expect(treeMapped.nodes[0].ui).toEqual({ editing: true })
      expect(treeMapped.nodes[0].nodes[0].ui).toEqual({ editing: true })
      expect(treeMapped.nodes[0].nodes[0].nodes[0].ui).toEqual({ editing: true })
      expect(treeMapped.nodes[0].nodes[0].nodes[1].ui).toEqual({ editing: true })
    })
  })


})
