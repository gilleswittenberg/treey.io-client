/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import getNodeData from '../../../app/lib/node/getNodeData'
import { uuid, uuid1, uuid2 } from '../../uuid'
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

  it('status CANCELLED', () => {
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
      status: 'CANCELLED',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1])
    expect(nodeData).toEqual({ title: 'Title' })
  })

  it('REVERT', () => {
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
      uuid: uuid1,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const transaction2 = {
      uuid: uuid2,
      node: uuid1,
      type: 'REVERT',
      status: 'PENDING',
      transaction: uuid1,
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1, transaction2])
    expect(nodeData).toEqual({ title: 'Title' })
  })

  it('revert REVERT', () => {
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
      uuid: uuid1,
      node: uuid1,
      type: 'SET',
      status: 'COMMITTED',
      data: {
        title: 'Title last'
      },
      modified: date,
      created: date
    }
    const transaction2 = {
      uuid: uuid2,
      node: uuid1,
      type: 'REVERT',
      status: 'PENDING',
      transaction: uuid1,
      modified: date,
      created: date
    }
    const transaction3 = {
      uuid,
      node: uuid1,
      type: 'REVERT',
      status: 'PENDING',
      transaction: uuid2,
      modified: date,
      created: date
    }
    const nodeData = getNodeData([transaction0, transaction1, transaction2, transaction3])
    expect(nodeData).toEqual({ title: 'Title last' })
  })
})
