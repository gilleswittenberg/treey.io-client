/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import setTransactionsIsReverted from '../../../app/lib/node/setTransactionsIsReverted'
import createTransaction from '../../../app/lib/node/createTransaction'
import { uuid } from '../../uuid'

describe('setTransactionsIsReverted', () => {

  it('non reverted', () => {
    const transaction = createTransaction('SET', uuid)
    const transactions = [transaction]
    const transactionsIsReverted = setTransactionsIsReverted(transactions)
    expect(transactionsIsReverted[0].isReverted).toBe(false)
  })

  it('reverted', () => {
    const transaction0 = createTransaction('SET', uuid)
    const transaction1 = createTransaction('REVERT', uuid, undefined, undefined, undefined, transaction0.uuid)
    const transactions = [transaction0, transaction1]
    const transactionsIsReverted = setTransactionsIsReverted(transactions)
    expect(transactionsIsReverted[0].isReverted).toBe(true)
    expect(transactionsIsReverted[1].isReverted).toBe(false)
  })
})
