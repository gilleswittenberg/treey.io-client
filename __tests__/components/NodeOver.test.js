import NodeOver from '../../app/components/NodeOver'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'

describe('NodeOver', () => {

  const getComponent = getComponentHOF(NodeOver)

  describe('position', () => {

    it('top', () => {

      const wrapper = shallow(getComponent({ position: 'top' }))
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-top')).toBe(true)
    })

    it('bottom', () => {

      const wrapper = shallow(getComponent({ position: 'bottom' }))
      expect(wrapper.hasClass('node-over')).toBe(true)
      expect(wrapper.hasClass('node-over-bottom')).toBe(true)
    })
  })
})
