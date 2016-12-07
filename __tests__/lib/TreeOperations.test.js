/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import { index, createAndAdd, update, remove, move, setUI, setUIUnique } from '../../app/lib/TreeOperations'

describe('TreeOperations', () => {

  describe('index', () => {

    it('parse', () => {

      const tree = {
        nodes: [{
          uid: '57bedc40e81b0620300d769b',
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
          uid: '57bedc40e81b0620300d769b',
          nodes: []
        }]
      }
      const path = ['57bedc40e81b0620300d769b']
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
          uid: '57bedc40e81b0620300d769b',
          title: 'Mr. Root',
          nodes: []
        }]
      }
      const path = ['57bedc40e81b0620300d769b']
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
          uid: '57bedc40e81b0620300d769a',
          nodes: [{
            uid: '57bedc40e81b0620300d769b',
            nodes: []
          }]
        }]
      }
      const path = ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b']
      const updatedTree = remove(tree, path)
      expect(updatedTree.nodes[0].nodes.length).toBe(0)
    })
  })

  describe('move', () => {

    it('move', () => {

      const tree = {
        nodes: [{
          uid: '57bedc40e81b0620300d769a',
          nodes: [
            {
              uid: '57bedc40e81b0620300d769b',
              nodes: [{ uid: '57bedc40e81b0620300d769c', nodes: [] }]
            },
            {
              uid: '57bedc40e81b0620300d769d',
              nodes: []
            }
          ]
        }]
      }
      const path = ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b', '57bedc40e81b0620300d769c']
      const newPath = ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769d']
      const updatedTree = move(tree, path, newPath)
      expect(updatedTree.nodes[0].nodes[0].nodes.length).toBe(0)
      expect(updatedTree.nodes[0].nodes[1].nodes.length).toBe(1)
    })
  })

  describe('setUI', () => {

    it('setUI', () => {

      const tree = {
        nodes: [{
          uid: '57bedc40e81b0620300d769b',
          title: 'Mr. Root',
          nodes: []
        }]
      }
      const path = ['57bedc40e81b0620300d769b']
      const nodeUI = {
        editing: true
      }
      const updatedTree = setUI(tree, path, nodeUI)
      expect(updatedTree.nodes.length).toBe(1)
      expect(updatedTree.nodes[0].ui).toEqual({ editing: true })
    })
  })

  describe('setUIUnique', () => {

    it('setUI', () => {

      const tree = {
        nodes: [{
          uid: '57bedc40e81b0620300d769a',
          ui: {
            editing: true
          },
          nodes: [{
            uid: '57bedc40e81b0620300d769b',
            nodes: [],
            ui: {
              editing: false
            }
          }]
        }]
      }
      const path = ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b']
      const nodeUI = {
        editing: true
      }
      const updatedTree = setUIUnique(tree, path, nodeUI)
      expect(updatedTree.nodes[0].ui).toEqual({ editing: false })
      expect(updatedTree.nodes[0].nodes[0].ui).toEqual({ editing: true })
    })
  })
})
