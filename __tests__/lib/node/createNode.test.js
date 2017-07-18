/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import createNode from '../../../app/lib/node/createNode'
import { uuid, uuid1 } from '../../uuid'
import date from '../../date'

describe('createNode', () => {

  it('node', () => {
    const transaction = {
      uuid,
      node: uuid1,
      type: 'CREATE',
      status: 'PENDING',
      modified: date,
      created: date
    }
    const node = createNode(uuid1, transaction)
    expect(node.uuid).toBe(uuid1)
    expect(node.transactions).toEqual([transaction])
    expect(node.nodes).toEqual([])
  })
})
