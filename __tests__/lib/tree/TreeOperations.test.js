/* @flow */

// required for Flow type
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
  selectActiveNode
} from '../../../app/lib/tree/TreeOperations'
import { uid, uid1, uid2, uid3, uid4 } from '../../uid'
import defaultUI from '../../../app/lib/ui/defaultUI'

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
      expect(indexedTree.nodes[0].path).toEqual([uid])
    })
  })

  describe('createAndAdd', () => {

    it('uid, path, data, ui', () => {

      const tree = {
        nodes: [{
          node: { uid, user: null, data: { title: '' }, ui: defaultUI },
          path: [uid],
          nodes: []
        }]
      }
      const path = [uid]
      const nodeData = {
        title: 'new'
      }
      const updatedTree = createAndAdd(tree, path, uid1, nodeData)
      expect(updatedTree.nodes[0].nodes.length).toBe(1)
      expect(updatedTree.nodes[0].nodes[0].node.uid).toBe(uid1)
      expect(updatedTree.nodes[0].nodes[0].path).toEqual([uid, uid1])
      expect(updatedTree.nodes[0].nodes[0].node.data).toEqual({ title: 'new' })
      expect(updatedTree.nodes[0].nodes[0].node.ui).not.toBe(null)
    })
  })

  describe('update', () => {

    it('update', () => {

      const tree = {
        nodes: [{
          node: { uid, user: null, data: { title: 'Mr. Root' }, ui: defaultUI },
          path: [uid],
          nodes: []
        }]
      }
      const path = [uid]
      const nodeData = {
        title: 'new'
      }
      const updatedTree = update(tree, path, nodeData)
      expect(updatedTree.nodes.length).toBe(1)
      expect(updatedTree.nodes[0].node.data).toEqual({ title: 'new' })
    })
  })

  describe('remove', () => {

    it('remove', () => {

      const tree = {
        nodes: [{
          node: { uid, user: null, data: { title: '' }, ui: defaultUI },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '' }, ui: defaultUI },
            path: [uid, uid1],
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
          node: { uid, user: null, data: { title: '' }, ui: defaultUI },
          path: [uid],
          nodes: [
            {
              node: { uid: uid1, user: null, data: { title: '' }, ui: defaultUI },
              path: [uid, uid1],
              nodes: [{
                node: { uid: uid2, user: null, data: { title: '' }, ui: defaultUI },
                path: [uid, uid1, uid2],
                nodes: [{
                  node: { uid: uid4, user: null, data: { title: '' }, ui: defaultUI },
                  path: [uid, uid1, uid4],
                  nodes: []
                }]
              }]
            },
            {
              node: { uid: uid3, user: null, data: { title: '' }, ui: defaultUI },
              path: [uid, uid3],
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
      expect(updatedTree.nodes[0].nodes[1].nodes[0].path).toEqual([uid, uid3, uid2])
      expect(updatedTree.nodes[0].nodes[1].nodes[0].nodes[0].path).toEqual([uid, uid3, uid2, uid4])
    })
  })

  describe('clearUI', () => {

    it('clearUI', () => {

      const tree = {
        nodes: [{
          node: {
            uid,
            user: null,
            data: {
              title: 'Mr. Root'
            },
            ui: {
              editing: false
            }
          },
          path: [uid],
          nodes: [
            {
              node: {
                uid: uid1,
                user: null,
                data: {
                  title: 'Active'
                },
                ui: {
                  editing: true
                }
              },
              path: [uid, uid1],
              nodes: []
            }
          ]
        }]
      }
      const updatedTree = clearUI(tree, ['editing'])
      expect(updatedTree.nodes[0].node.ui).toEqual({ editing: false })
    })
  })

  describe('setUI', () => {

    it('setUI', () => {

      const tree = {
        nodes: [{
          node: {
            uid,
            user: null,
            data: { title: 'Mr. Root' },
            ui: defaultUI,
            nodes: []
          },
          path: [uid],
          nodes: []
        }]
      }
      const path = [uid]
      const nodeUI = {
        editing: true
      }
      const updatedTree = setUI(tree, path, nodeUI)
      expect(updatedTree.nodes.length).toBe(1)
      expect(updatedTree.nodes[0].node.ui.editing).toBe(true)
    })
  })

  describe('selectActiveNode', () => {

    it('next', () => {

      const tree = {
        nodes: [{
          node: { uid, user: null, data: { title: '' }, ui: { ...defaultUI, expanded: true, active: true } },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '' }, ui: { ...defaultUI, active: false } },
            path: [uid, uid1],
            nodes: []
          }]
        }]
      }
      const tuple = selectActiveNode(tree, [uid], 'NEXT')
      const updatedTree = tuple[0]
      const activePath = tuple[1]
      expect(updatedTree.nodes[0].node.ui.active).toBe(false)
      expect(updatedTree.nodes[0].nodes[0].node.ui.active).toEqual(true)
      expect(activePath).toEqual([uid, uid1])
    })

    it('prev', () => {

      const tree = {
        nodes: [{
          node: { uid, user: null, data: { title: '' }, ui: { ...defaultUI, expanded: true } },
          path: [uid],
          nodes: [{
            node: { uid: uid1, user: null, data: { title: '' }, ui: { ...defaultUI, active: true } },
            path: [uid, uid1],
            nodes: []
          }]
        }]
      }
      const tuple = selectActiveNode(tree, [uid, uid1], 'PREV')
      const updatedTree = tuple[0]
      const activePath = tuple[1]
      expect(updatedTree.nodes[0].node.ui.active).toBe(true)
      expect(updatedTree.nodes[0].nodes[0].node.ui.active).toBe(false)
      expect(activePath).toEqual([uid])
    })
  })
})
