import React from 'react'
import { NodeEdit } from '../../app/components/NodeEdit'
import { shallow } from 'enzyme'

describe('NodeEdit', () => {

  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const noop = () => {}

  function getWrapper (args) {

    const defaultProps = {
      lang: 'en',
      parent,
      uid,
      title: '',
      unsetIsEditing: noop,
      putNode: noop,
      deleteNode: noop
    }
    const props = Object.assign(defaultProps, args)

    return shallow(
      <NodeEdit
        lang={ props.lang }
        parent={ props.parent }
        uid={ props.uid }
        title={ props.title }
        unsetIsEditing={ props.unsetIsEditing }
        putNode={ props.putNode }
        deleteNode={ props.deleteNode }
      />
    )
  }

  it('change', () => {
    const wrapper = getWrapper()
    const input = document.createElement('input')
    input.value = 'user input'
    const mockEvent = { target: input }
    wrapper.find('input').simulate('change', mockEvent)
    expect(wrapper.state().title).toEqual('user input')
  })

  describe('sumbit', () => {

    it('deleteNode', () => {
      const unsetIsEditing = jest.fn()
      const deleteNode = jest.fn()
      const wrapper = getWrapper({ unsetIsEditing, deleteNode })
      const mockEvent = { preventDefault: () => {} }
      wrapper.find('form').simulate('submit', mockEvent)
      expect(unsetIsEditing.mock.calls.length).toBe(1)
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('putNode', () => {
      const unsetIsEditing = jest.fn()
      const putNode = jest.fn()
      const wrapper = getWrapper({ unsetIsEditing, putNode })
      wrapper.setState({ title: 'user input' })
      const mockEvent = { preventDefault: () => {} }
      wrapper.find('form').simulate('submit', mockEvent)
      expect(unsetIsEditing.mock.calls.length).toBe(1)
      expect(putNode.mock.calls.length).toBe(1)
      expect(putNode.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
})
