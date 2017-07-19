/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import getNodeData from '../../../app/lib/node/getNodeData'
import { uuid, uuid1 } from '../../uuid'
import date from '../../date'

describe('getNodeData', () => {

  it('no SET', () => {
    const nodeData = getNodeData([])
    expect(nodeData).toEqual(null)
  })

  it('SET last', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title'
      },
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1])
    expect(nodeData).toEqual({ title: 'Title last' })
  })

  it('status PENDING', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title'
      },
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'PENDING',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1])
    expect(nodeData).toEqual({ title: 'Title last' })
  })

  it('status DENIED', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title'
      },
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid,
      node: uuid1,
      type: 'SET',
      status: 'DENIED',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1])
    expect(nodeData).toEqual({ title: 'Title' })
  })
})
