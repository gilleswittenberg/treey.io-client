import React from 'react'
import { NodeAdd } from '../../app/components/NodeAdd'
import { shallow } from 'enzyme'

describe('NodeAdd', () => {

  const parent = '57bedc40e81b0620300d769a'
  const noop = () => {}

  function getWrapper (args) {

    const defaultProps = {
      lang: 'en',
      parent,
      isEditing: false,
      setIsEditing: noop,
      unsetIsEditing: noop,
      expand: noop,
      postNode: noop
    }

    const props = Object.assign(defaultProps, args)

    return shallow(
      <NodeAdd
        lang={ props.lang }
        parent={ props.parent }
        isEditing={ props.isEditing }
        setIsEditing={ props.setIsEditing }
        unsetIsEditing={ props.unsetIsEditing }
        expand={ props.expand }
        postNode={ props.postNode }
      />
    )
  }

  describe('editing', () => {

    it('false', () => {
      const wrapper = getWrapper()
      expect(wrapper.render().find('input').length).toBe(0)
    })

    it('true', () => {
      const wrapper = getWrapper({ isEditing: true })
      expect(wrapper.render().find('input').length).toBe(1)
    })
  })

  describe('state title', () => {

    it('clear on isEditing change', () => {

      const wrapper = getWrapper()
      wrapper.setState({ title: 'user input' })
      expect(wrapper.state().title).toBe('user input')
      wrapper.setProps({ isEditing: true })
      expect(wrapper.state().title).toBe('')
    })
  })

  describe('input', () => {

    it('change', () => {

      const wrapper = getWrapper({ isEditing: true })
      const input = document.createElement('input')
      input.value = 'user input'
      const mockEvent = { target: input }
      wrapper.find('input').simulate('change', mockEvent)
      expect(wrapper.state().title).toEqual('user input')
    })

    it('sumbit', () => {

      const unsetIsEditing = jest.fn()
      const postNode = jest.fn()
      const wrapper = getWrapper({ isEditing: true, unsetIsEditing, postNode })

      wrapper.setState({ title: 'user input' })
      const mockEvent = { preventDefault: () => {} }
      wrapper.find('form').simulate('submit', mockEvent)
      expect(wrapper.state().title).toEqual('')
      expect(unsetIsEditing.mock.calls.length).toBe(1)
      expect(postNode.mock.calls.length).toBe(1)
      expect(postNode.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
})
