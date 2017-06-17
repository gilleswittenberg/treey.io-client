/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import NodeOver from '../../app/components/NodeOver'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'

describe('NodeOver', () => {

  const getComponent = getComponentHOF(NodeOver)

  describe('position', () => {

    it('above', () => {

      const wrapper = shallow(getComponent({ position: 'above' }))
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-above')).toBe(true)
    })

    it('below', () => {

      const wrapper = shallow(getComponent({ position: 'below' }))
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-below')).toBe(true)
    })
  })
})
