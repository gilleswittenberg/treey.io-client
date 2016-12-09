/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import Tree from '../../app/components/Tree'
import { shallow, render } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { defaultActions } from '../../app/lib/actions'
import defaultUI from '../../app/lib/defaultUI'
import { uid, uid1, uid2, uid3, uid4, uid5, uid6, uid7 } from '../uid'

describe('Tree', () => {

  const app = { lang: 'en', enableDnD: false }
  const ui = defaultUI

  const defaultProps = {
    app,
    ...defaultActions,
    tree: null,
    updateNodeUI: noop,
    unsetIsEditing: noop
  }
  const getComponent = getComponentHOF(Tree.DecoratedComponent, defaultProps)

  describe('index', () => {

    it('null', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('Nodes').length).toBe(0)
    })

    it('nodes', () => {
      const tree = {
        uid: uid1,
        path: [uid1],
        nodes: [{
          uid: uid2,
          path: [uid1, uid2],
          ui
        }],
        ui
      }
      const wrapper = shallow(getComponent({ tree }))
      expect(wrapper.find('Nodes').length).toBe(1)
    })

    it('nodes deep', () => {
      const tree = {
        uid,
        path: [uid],
        data: {
          title: 'John Doe'
        },
        ui,
        nodes: [
          {
            uid: uid1,
            path: [uid, uid1],
            data: {
              title: 'ToDo'
            },
            ui,
            nodes: [
              {
                uid: uid2,
                path: [uid, uid1, uid2],
                data: { title: 'bring home the milk' },
                ui
              },
              {
                uid: uid3,
                path: [uid, uid1, uid3],
                data: { title: 'clean the house' },
                ui
              }
            ]
          },
          {
            uid: uid4,
            path: [uid, uid4],
            data: {
              title: 'Movies'
            },
            ui,
            nodes: [
              {
                uid: uid5,
                path: [uid, uid4, uid5],
                data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
                ui
              },
              {
                uid: uid6,
                path: [uid, uid4, uid6],
                data: { title: 'The Terminator (1984)' },
                ui
              },
              {
                uid: uid7,
                path: [uid, uid4, uid7],
                data: { title: 'The Matrix (1999)' },
                ui
              }
            ]
          }
        ]
      }
      const wrapper = render(getComponent({ tree }))
      // deepest child nodes 3 + 2
      expect(wrapper.find('ul ul ul ul').length).toBe(3 + 2)
    })

    it('componentWillReceiveProps', () => {

      const updateNodeUI = jest.fn()
      const wrapper = shallow(getComponent({ updateNodeUI }))
      const tree = { uid: uid1, ui }
      wrapper.setProps({ tree })
      // @TODO: Add tests for arguments updateNodeUI
      expect(updateNodeUI.mock.calls.length).toBe(2)
    })
  })
})
