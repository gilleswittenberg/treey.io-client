/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import Tree from '../../app/components/Tree'
import { shallow, render } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { defaultActions } from '../../app/lib/ui/actions'
import defaultUI from '../../app/lib/ui/defaultUI'
import { uid, uid1, uid2, uid3, uid4, uid5, uid6, uid7 } from '../uid'

describe('Tree', () => {

  const app = { lang: 'en', enableDnD: false }
  const ui = defaultUI

  const defaultProps = {
    app,
    ...defaultActions,
    tree: null,
    nodesArray: [],
    updateNodeUI: noop,
    unsetIsEditing: noop
  }
  const getComponent = getComponentHOF(Tree.DecoratedComponent, defaultProps)

  describe('index', () => {

    it('empty nodesArray', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('Nodes').length).toBe(0)
    })

    it('nodesArray', () => {
      const nodesArray = [{
        uid: uid1,
        nodes: [],
        ui
      }]
      const wrapper = shallow(getComponent({ nodesArray }))
      expect(wrapper.find('Nodes').length).toBe(1)
    })

    it('nodesArray deep', () => {
      const nodesArray = [
        {
          uid,
          data: { title: 'John Doe' },
          nodes: [uid1, uid4]
        },
        {
          uid: uid1,
          data: { title: 'ToDo' },
          nodes: [uid2, uid3]
        },
        {
          uid: uid2,
          data: { title: 'bring home the milk' },
          nodes: []
        },
        {
          uid: uid3,
          data: { title: 'clean the house' },
          nodes: []
        },
        {
          uid: uid4,
          data: { title: 'Movies' },
          nodes: [uid5, uid6, uid7]
        },
        {
          uid: uid5,
          data: { title: 'The Terminator (1984)' },
          nodes: []
        }, {
          uid: uid6,
          data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
          nodes: []
        }, {
          uid: uid7,
          data: { title: 'The Matrix (1999)' },
          nodes: []
        }
      ]
      const wrapper = render(getComponent({ nodesArray }))
      // @TODO: Better DOM selector
      // deepest child nodes 3 + 2
      expect(wrapper.find('ul ul ul ul').length).toBe(3 + 2)
    })

    // @TODO: Check if still necessary. Remove / update
    it('componentWillReceiveProps', () => {

      const setUIExpanded = jest.fn()
      const wrapper = shallow(getComponent({ setUIExpanded }))
      const tree = {
        nodes: [{ node: {
          uid: uid1,
          data: { title: '' },
          ui: defaultUI
        } }]
      }
      wrapper.setProps({ tree })
      expect(setUIExpanded.mock.calls.length).toBe(1)
    })
  })
})
