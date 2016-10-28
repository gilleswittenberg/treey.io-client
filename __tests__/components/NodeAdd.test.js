import React from 'react'
import { NodeAdd } from '../../app/components/NodeAdd'
import { shallow } from 'enzyme'

describe('NodeAdd', () => {

  const parent = '57bedc40e81b0620300d769a'

  describe('editing', () => {

    const noop = () => {}

    it('false', () => {

      const wrapper = shallow(
        <NodeAdd
          lang={ 'en' }
          parent={ parent }
          isEditing={ false }
          setIsEditing={ noop }
          unsetIsEditing={ noop }
          expand={ noop }
          postNode={ noop }
        />
      )

      expect(wrapper.render().find('input').length).toBe(0)
    })

    it('true', () => {

      const noop = () => {}

      const wrapper = shallow(
        <NodeAdd
          lang={ 'en' }
          parent={ parent }
          isEditing={ true }
          setIsEditing={ noop }
          unsetIsEditing={ noop }
          expand={ noop }
          postNode={ noop }
        />
      )

      expect(wrapper.render().find('input').length).toBe(1)
    })
  })

  describe('state title', () => {

    it('clear on isEditing change', () => {

      const noop = () => {}

      const wrapper = shallow(
        <NodeAdd
          lang={ 'en' }
          parent={ parent }
          isEditing={ false }
          setIsEditing={ noop }
          unsetIsEditing={ noop }
          expand={ noop }
          postNode={ noop }
        />
      )

      wrapper.setState({ title: 'user input' })
      expect(wrapper.state().title).toBe('user input')
      wrapper.setProps({ isEditing: true })
      expect(wrapper.state().title).toBe('')
    })
  })

  describe('input', () => {

    it('change', () => {

      const noop = () => {}

      const wrapper = shallow(
        <NodeAdd
          lang={ 'en' }
          parent={ parent }
          isEditing={ false }
          setIsEditing={ noop }
          unsetIsEditing={ noop }
          expand={ noop }
          postNode={ noop }
        />
      )

      wrapper.setProps({ isEditing: true })
      const input = document.createElement('input')
      input.value = 'user input'
      const mockEvent = { target: input }
      wrapper.find('input').simulate('change', mockEvent)
      expect(wrapper.state().title).toEqual('user input')
    })

    it('sumbit', () => {

      const noop = () => {}
      const unsetIsEditing = jest.fn()
      const putNode = jest.fn()

      const wrapper = shallow(
        <NodeAdd
          lang={ 'en' }
          parent={ parent }
          isEditing={ true }
          setIsEditing={ noop }
          unsetIsEditing={ unsetIsEditing }
          expand={ noop }
          postNode={ putNode }
        />
      )

      wrapper.setState({ title: 'user input' })
      const mockEvent = { preventDefault: () => {} }
      wrapper.find('form').simulate('submit', mockEvent)
      expect(wrapper.state().title).toEqual('')
      expect(unsetIsEditing.mock.calls.length).toBe(1)
      expect(putNode.mock.calls.length).toBe(1)
      expect(putNode.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
})
