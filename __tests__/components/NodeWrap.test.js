import React, { Component } from 'react'
import NodeWrap from '../../app/components/NodeWrap'
import { mount } from 'enzyme'
import { DragDropContext } from 'react-dnd'
import TestBackend from 'react-dnd-test-backend'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import noop from '../noop'

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

  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const uid2 = '57bedc40e81b0620300d769c'
  const uid3 = '57bedc40e81b0620300d769d'

  function getProvider (args) {

    const defaultProps = {
      ui: {},
      nodes: [],
      siblings: [],
      index: 0,
      actions: {
        setIsEditing: noop,
        unsetIsEditing: noop,
        setIsDragging: noop,
        unsetIsDragging: noop,
        setShowButtons: noop,
        expand: noop,
        toggleExpanded: noop,
        putNode: noop,
        postNode: noop,
        deleteNode: noop,
        putMoveNode: noop
      }
    }
    const props = { ...defaultProps, ...args }
    const mockStore = configureStore([])
    const store = mockStore({})
    const NodeWrapContext = wrapInTestContext(NodeWrap)

    return (
      <Provider store={ store }>
        <NodeWrapContext
          lang= { 'en' }
          parent={ parent }
          isRoot={ false }
          uid={ uid }
          title={ 'title' }
          nodes={ props.nodes }
          siblings={ props.siblings }
          index={ props.index }
          hasNodes={ props.nodes.length > 0 }
          ui={ props.ui }
          isEditing={ props.isEditing }
          actions={ props.actions }
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
      expect(wrapper.find('NodeEdit').length).toBe(0)
    })

    it('true', () => {
      const wrapper = mount(getProvider({ ui: { editing: uid } }))
      expect(wrapper.find('NodeEdit').length).toBe(1)
    })
  })
})
