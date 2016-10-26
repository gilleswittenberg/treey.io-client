import React from 'react'
import NodeOver from '../../app/components/NodeOver'
import { shallow } from 'enzyme'

describe('NodeOver', () => {

  describe('position', () => {

    it('top', () => {

      const wrapper = shallow(
        <NodeOver
          position={ 'top' }
        />
      )
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-top')).toBe(true)
    })

    it('bottom', () => {

      const wrapper = shallow(
        <NodeOver
          position={ 'bottom' }
        />
      )
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-bottom')).toBe(true)
    })
  })
})
