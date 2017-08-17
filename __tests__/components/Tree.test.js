/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Tree from '../../app/components/Tree'
import { shallow, render } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { defaultActions } from '../../app/lib/ui/actions'
import defaultUI from '../../app/lib/ui/defaultUI'
import { uuid, uuid1, uuid2, uuid3, uuid4, uuid5, uuid6, uuid7 } from '../uuid'

describe('Tree', () => {

  const app = { lang: 'en', enableDnD: false }
  const ui = defaultUI

  const defaultProps = {
    app,
    ...defaultActions,
    ui,
    nodesArray: [],
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
        uuid: uuid1,
        nodes: [],
        ui
      }]
      const wrapper = shallow(getComponent({ nodesArray }))
      expect(wrapper.find('Nodes').length).toBe(1)
    })

    it('nodesArray deep', () => {
      const nodesArray = [
        {
          uuid,
          data: { title: 'John Doe' },
          nodes: [uuid1, uuid4]
        },
        {
          uuid: uuid1,
          data: { title: 'ToDo' },
          nodes: [uuid2, uuid3]
        },
        {
          uuid: uuid2,
          data: { title: 'bring home the milk' },
          nodes: []
        },
        {
          uuid: uuid3,
          data: { title: 'clean the house' },
          nodes: []
        },
        {
          uuid: uuid4,
          data: { title: 'Movies' },
          nodes: [uuid5, uuid6, uuid7]
        },
        {
          uuid: uuid5,
          data: { title: 'The Terminator (1984)' },
          nodes: []
        }, {
          uuid: uuid6,
          data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
          nodes: []
        }, {
          uuid: uuid7,
          data: { title: 'The Matrix (1999)' },
          nodes: []
        }
      ]
      const wrapper = render(<MemoryRouter>{ getComponent({ nodesArray }) }</MemoryRouter>)
      // @TODO: Better DOM selector
      // Deepest child nodes 3 + 2
      expect(wrapper.find('ul ul ul ul').length).toBe(3 + 2)
    })
  })

  describe('redirect', () => {

    it('redirectToNodeId', () => {
      const wrapper = shallow(getComponent())
      wrapper.setState({ redirectToNodeId: uuid })
      expect(wrapper.find('Redirect').length).toBe(1)
    })
  })
})
