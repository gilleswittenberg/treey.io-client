import React, { Component } from 'react'
import { NodeWrap } from '../../app/components/NodeWrap'
import { mount } from 'enzyme'
import { DragDropContext } from 'react-dnd'
import TestBackend from 'react-dnd-test-backend'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

// @LINK: https://github.com/gaearon/react-dnd/blob/master/docs/00%20Quick%20Start/Testing.md
function wrapInTestContext (DecoratedComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render () {
      return <DecoratedComponent { ...this.props } />
    }
  }
  return TestContextContainer
}

describe('NodeWrap', () => {

  const noop = () => {}
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const uid2 = '57bedc40e81b0620300d769c'
  const uid3 = '57bedc40e81b0620300d769d'
  const ui = { expanded: [] }

  function getProvider (args) {

    const defaultProps = {
      nodes: [],
      isEditing: false,
      putNode: noop
    }
    const props = Object.assign(defaultProps, args)

    const mockStore = configureStore([])
    const store = mockStore({})
    const NodeWrapContext = wrapInTestContext(NodeWrap)

    return (
      <Provider store={ store }>
        <NodeWrapContext
          parent={ parent }
          isRoot={ false }
          uid={ uid }
          title={ 'title' }
          nodes={ props.nodes }
          hasNodes={ props.nodes.length > 0 }
          ui={ ui }
          isEditing={ props.isEditing }
          setIsEditing={ noop }
          unsetIsEditing={ noop }
          setShowButtons={ noop }
          expand={ noop }
          toggleExpanded={ noop }
          postNode={ noop }
          putNode={ props.putNode }
          deleteNode={ noop }
          putMoveNode={ noop }
        />
      </Provider>
    )
  }

  describe('construct', () => {

    it('node', () => {
      const wrapper = mount(getProvider())
      expect(wrapper.render().find('.node').length).toBe(2)
    })

    describe('nodes', () => {

      it('empty', () => {
        const wrapper = mount(getProvider())
        // only <li> is for NodeAdd
        expect(wrapper.render().find('ul li').length).toBe(1)
      })

      it('non empty', () => {
        const wrapper = mount(getProvider({
          nodes: [
            { uid: uid2, title: 'two' },
            { uid: uid3, title: 'three' }
          ]
        }))
        // <li> for NodeAdd, 2 Node + 2 NodeAdd
        expect(wrapper.render().find('ul > li').length).toBe(5)
      })
    })
  })

  describe('isEditing', () => {

    it('false', () => {
      const wrapper = mount(getProvider())
      expect(wrapper.render().find('form').length).toBe(0)
    })

    it('true', () => {
      const wrapper = mount(getProvider({ isEditing: true }))
      expect(wrapper.render().find('form').length).toBe(1)
    })
  })

  /*
  describe('form submit', () => {

    it('sumbit', () => {
      const putNode = jest.fn()
      const wrapper = mount(getProvider({ isEditing: true, putNode }))
      wrapper.find(Node).setState({ title: 'user input' })
      const mockEvent = { preventDefault: () => {} }
      console.log(wrapper.find('form').length)
      wrapper.find('form').simulate('submit', mockEvent)
      expect(putNode.mock.calls.length).toBe(1)
      expect(putNode.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
  */
})
