/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import {
  index,
  createAndAdd,
  update,
  remove,
  move,
  clearUI,
  setUI,
  setUIActiveNode,
  setUIUnique,
  selectActiveNode
} from '../../app/lib/TreeOperations'
import { uid, uid1, uid2, uid3 } from '../uid'

describe('TreeOperations', () => {

  describe('index', () => {

    it('parse', () => {

      const tree = {
        nodes: [{
          uid,
          nodes: []
        }]
      }
      const indexedTree = index(tree)
      expect(indexedTree.nodes.length).toBe(1)
      expect(indexedTree.nodes[0].path).not.toBe(null)
    })
  })

  describe('createAndAdd', () => {

    it('createAndAdd', () => {

      const tree = {
        nodes: [{
          uid,
          nodes: []
        }]
      }
      const path = [uid]
      const nodeData = {
        title: 'new'
      }
      const updatedTree = createAndAdd(tree, path, nodeData)
      expect(updatedTree.nodes[0].nodes.length).toBe(1)
      expect(updatedTree.nodes[0].nodes[0].data).toEqual({ title: 'new' })
      expect(updatedTree.nodes[0].nodes[0].ui).not.toBe(null)
    })
  })

  describe('update', () => {

    it('update', () => {

      const tree = {
        nodes: [{
          uid,
          title: 'Mr. Root',
          nodes: []
        }]
      }
      const path = [uid]
      const nodeData = {
        title: 'new'
      }
      const updatedTree = update(tree, path, nodeData)
      expect(updatedTree.nodes.length).toBe(1)
      expect(updatedTree.nodes[0].data).toEqual({ title: 'new' })
    })
  })

  describe('remove', () => {

    it('remove', () => {

      const tree = {
        nodes: [{
          uid,
          nodes: [{
            uid: uid1,
            nodes: []
          }]
        }]
      }
      const path = [uid, uid1]
      const updatedTree = remove(tree, path)
      expect(updatedTree.nodes[0].nodes.length).toBe(0)
    })
  })

  describe('move', () => {

    it('move', () => {

      const tree = {
        nodes: [{
          uid,
          nodes: [
            {
              uid: uid1,
              nodes: [{ uid: uid2, nodes: [] }]
            },
            {
              uid: uid3,
              nodes: []
            }
          ]
        }]
      }
      const path = [uid, uid1, uid2]
      const newPath = [uid, uid3]
      const updatedTree = move(tree, path, newPath)
      expect(updatedTree.nodes[0].nodes[0].nodes.length).toBe(0)
      expect(updatedTree.nodes[0].nodes[1].nodes.length).toBe(1)
    })
  })

  describe('clearUI', () => {

    it('clearUI', () => {

      const tree = {
        nodes: [{
          uid,
          data: {
            title: 'Mr. Root'
          },
          ui: {
            editing: false
          },
          nodes: [
            {
              uid: uid1,
              data: {
                title: 'Active'
              },
              ui: {
                editing: true
              },
              nodes: []
            }
          ]
        }]
      }
      const updatedTree = clearUI(tree, ['editing'])
      expect(updatedTree.nodes[0].ui).toEqual({ editing: false })
    })
  })

  describe('setUI', () => {

    it('setUI', () => {

      const tree = {
        nodes: [{
          uid,
          title: 'Mr. Root',
          nodes: []
        }]
      }
      const path = [uid]
      const nodeUI = {
        editing: true
      }
      const updatedTree = setUI(tree, path, nodeUI)
      expect(updatedTree.nodes.length).toBe(1)
      expect(updatedTree.nodes[0].ui).toEqual({ editing: true })
    })
  })

  describe('setUIActiveNode', () => {

    it('setUIActiveNode', () => {

      const tree = {
        nodes: [{
          uid,
          data: {
            title: 'Mr. Root'
          },
          ui: {
            active: false
          },
          nodes: [
            {
              uid: uid1,
              data: {
                title: 'Active'
              },
              ui: {
                active: true,
                editing: false
              },
              nodes: []
            }
          ]
        }]
      }
      const updatedTree = setUIActiveNode(tree, 'editing', true)
      expect(updatedTree.nodes[0].nodes[0].ui).toEqual({ active: true, editing: true })
    })
  })

  describe('setUIUnique', () => {

    it('setUI', () => {

      const tree = {
        nodes: [{
          uid,
          ui: {
            editing: true,
            expanded: true
          },
          nodes: [{
            uid: uid1,
            nodes: [],
            ui: {
              editing: false,
              expanded: false
            }
          }]
        }]
      }
      const path = [uid, uid1]
      const nodeUI = {
        editing: true
      }
      const updatedTree = setUIUnique(tree, path, nodeUI)
      expect(updatedTree.nodes[0].ui).toEqual({ editing: false, expanded: true })
      expect(updatedTree.nodes[0].nodes[0].ui).toEqual({ editing: true, expanded: false })
    })
  })

  describe('selectActiveNode', () => {

    it('next', () => {

      const tree = {
        nodes: [{
          uid,
          path: [uid],
          ui: {
            expanded: true,
            active: true
          },
          nodes: [{
            uid: uid1,
            path: [uid, uid1],
            nodes: [],
            ui: {
              active: false
            }
          }]
        }]
      }
      const updatedTree = selectActiveNode(tree, 'NEXT')
      expect(updatedTree.nodes[0].ui).toEqual({ expanded: true, active: false })
      expect(updatedTree.nodes[0].nodes[0].ui).toEqual({ active: true })
    })

    it('prev', () => {

      const tree = {
        nodes: [{
          uid,
          path: [uid],
          ui: {
            expanded: true
          },
          nodes: [{
            uid: uid1,
            path: [uid, uid1],
            nodes: [],
            ui: {
              active: true
            }
          }]
        }]
      }
      const updatedTree = selectActiveNode(tree, 'PREV')
      expect(updatedTree.nodes[0].ui).toEqual({ expanded: true, active: true })
      expect(updatedTree.nodes[0].nodes[0].ui).toEqual({ active: false })
    })
  })
})
