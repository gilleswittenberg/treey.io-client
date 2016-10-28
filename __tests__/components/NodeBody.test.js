import React from 'react'
import { NodeBody } from '../../app/components/NodeBody'
import { shallow } from 'enzyme'

describe('NodeBody', () => {

  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const noop = () => {}

  function getWrapper (args) {

    const defaultProps = {
      parent,
      uid,
      title: '',
      showAddButton: false,
      showDeleteButton: false,
      isEditing: false,
      allowExpanding: false,
      unsetIsEditing: noop,
      setIsEditing: noop,
      toggleExpanded: noop,
      deleteNode: noop,
      setShowButtons: noop
    }
    const props = Object.assign(defaultProps, args)

    return shallow(
      <NodeBody
        parent={ props.parent }
        uid={ props.uid }
        title={ props.title }
        showAddButton={ props.showAddButton }
        showDeleteButton={ props.showDeleteButton }
        isEditing={ props.isEditing }
        allowExpanding={ props.allowExpanding }
        unsetIsEditing={ props.unsetIsEditing }
        setIsEditing={ props.setIsEditing }
        toggleExpanded={ props.toggleExpanded }
        deleteNode={ props.deleteNode }
        setShowButtons={ props.setShowButtons }
      />
    )
  }

  describe('handleClick', () => {

    it('altKey', () => {
      const setIsEditing = jest.fn()
      const wrapper = getWrapper({ setIsEditing })
      const mockEvent = { altKey: true }
      wrapper.find('div.node-content').simulate('click', mockEvent)
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('allowExpanding', () => {
      const toggleExpanded = jest.fn()
      const wrapper = getWrapper({ toggleExpanded })
      wrapper.find('div.node-content').simulate('click', {})
      expect(toggleExpanded.mock.calls.length).toBe(0)
    })

    it('toggleExpanded', () => {
      const toggleExpanded = jest.fn()
      const wrapper = getWrapper({ allowExpanding: true, toggleExpanded })
      wrapper.find('div.node-content').simulate('click', {})
      expect(toggleExpanded.mock.calls.length).toBe(1)
    })
  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const setIsEditing = jest.fn()
      const wrapper = getWrapper({ setIsEditing })
      wrapper.find('button[title="edit"]').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('handleClickAdd', () => {
      const setIsEditing = jest.fn()
      const wrapper = getWrapper({ setIsEditing, showAddButton: true })
      wrapper.find('button[title="add"]').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
      expect(setIsEditing.mock.calls[0][1]).toEqual('add')
    })
  })

  describe('handleClickDelete', () => {

    it('non root', () => {
      const deleteNode = jest.fn()
      const wrapper = getWrapper({
        showDeleteButton: true,
        deleteNode
      })
      wrapper.find('button[title="delete"]').simulate('click')
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('root', () => {
      const deleteNode = jest.fn()
      const wrapper = getWrapper({
        parent: null,
        showDeleteButton: true
      })
      wrapper.find('button[title="delete"]').simulate('click')
      expect(deleteNode.mock.calls.length).toBe(0)
    })
  })

  describe('handleClickShowButtons', () => {

    it('click', () => {
      const setShowButtons = jest.fn()
      const wrapper = getWrapper({ setShowButtons })
      const eventMock = { stopPropagation: noop }
      wrapper.find('button.node-button-show-buttons').simulate('click', eventMock)
      expect(setShowButtons.mock.calls.length).toBe(1)
    })
  })

  describe('content', () => {

    it('text', () => {
      const wrapper = getWrapper({ title: 'text' })
      expect(wrapper.find('a').length).toBe(0)
    })

    it('URL', () => {
      const wrapper = getWrapper({ title: 'http://treey.io' })
      expect(wrapper.find('a').length).toBe(1)
    })
  })
})
