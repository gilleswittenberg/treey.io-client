/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import getNodes from '../../../app/lib/node/getNodes'
import { uuid, uuid1, uuid2, uuid3, uuid4 } from '../../uuid'
import date from '../../date'

describe('getNodeData', () => {

  it('no ADD_CHILD, REMOVE_CHILD', () => {
    const nodes = getNodes([])
    expect(nodes).toEqual([])
  })

  it('ADD_CHILD', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid: uuid1,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid3,
      modified: date,
      created: date
    }
    const nodes = getNodes([transaction0, transaction1])
    expect(nodes).toEqual([uuid2, uuid3])
  })

  it('ADD_CHILD before', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid: uuid1,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid3,
      before: uuid2,
      modified: date,
      created: date
    }
    const nodes = getNodes([transaction0, transaction1])
    expect(nodes).toEqual([uuid3, uuid2])
  })

  it('REMOVE_CHILD', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid: uuid1,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid3,
      modified: date,
      created: date
    }
    const transaction2 = {
      uuid: uuid2,
      node: uuid1,
      type: 'REMOVE_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const nodes = getNodes([transaction0, transaction1, transaction2])
    expect(nodes).toEqual([uuid3])
  })

  it('status DENIED', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid: uuid1,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'DENIED',
      child: uuid3,
      modified: date,
      created: date
    }
    const nodes = getNodes([transaction0, transaction1])
    expect(nodes).toEqual([uuid2])
  })

  it('status CANCELLED', () => {
    const transaction0 = {
      uuid,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'COMMITTED',
      child: uuid2,
      modified: date,
      created: date
    }
    const transaction1 = {
      uuid: uuid1,
      node: uuid1,
      type: 'ADD_CHILD',
      status: 'CANCELLED',
      child: uuid3,
      modified: date,
      created: date
    }
    const nodes = getNodes([transaction0, transaction1])
    expect(nodes).toEqual([uuid2])
  })

  describe('REVERT', () => {

    it('ADD_CHILD', () => {
      const transaction0 = {
        uuid,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid2,
        modified: date,
        created: date
      }
      const transaction1 = {
        uuid: uuid1,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid3,
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
      const nodes = getNodes([transaction0, transaction1, transaction2])
      expect(nodes).toEqual([uuid2])
    })

    it('ADD_CHILD before', () => {
      const transaction0 = {
        uuid,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid2,
        modified: date,
        created: date
      }
      const transaction1 = {
        uuid: uuid1,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid3,
        modified: date,
        created: date
      }
      const transaction2 = {
        uuid: uuid2,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid4,
        before: uuid2,
        modified: date,
        created: date
      }
      const transaction3 = {
        uuid: uuid3,
        node: uuid1,
        type: 'REVERT',
        status: 'PENDING',
        transaction: uuid,
        modified: date,
        created: date
      }
      const nodes = getNodes([transaction0, transaction1, transaction2, transaction3])
      expect(nodes).toEqual([uuid4, uuid3])
    })

    it('REMOVE_CHILD', () => {
      const transaction0 = {
        uuid,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid2,
        modified: date,
        created: date
      }
      const transaction1 = {
        uuid: uuid1,
        node: uuid1,
        type: 'REMOVE_CHILD',
        status: 'COMMITTED',
        child: uuid2,
        modified: date,
        created: date
      }
      const transaction2 = {
        uuid: uuid3,
        node: uuid1,
        type: 'REVERT',
        status: 'PENDING',
        transaction: uuid1,
        modified: date,
        created: date
      }
      const nodes = getNodes([transaction0, transaction1, transaction2])
      expect(nodes).toEqual([uuid2])
    })

    it('REVERT', () => {
      const transaction0 = {
        uuid,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid2,
        modified: date,
        created: date
      }
      const transaction1 = {
        uuid: uuid1,
        node: uuid1,
        type: 'ADD_CHILD',
        status: 'COMMITTED',
        child: uuid3,
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
        uuid: uuid3,
        node: uuid1,
        type: 'REVERT',
        status: 'PENDING',
        transaction: uuid2,
        modified: date,
        created: date
      }
      const nodes = getNodes([transaction0, transaction1, transaction2, transaction3])
      expect(nodes).toEqual([uuid2, uuid3])
    })
  })
})
