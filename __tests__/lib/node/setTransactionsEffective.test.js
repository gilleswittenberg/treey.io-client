/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import setTransactionsEffective from '../../../app/lib/node/setTransactionsEffective'
import createTransaction from '../../../app/lib/node/createTransaction'
import { uuid, uuid1, uuid2, uuid3 } from '../../uuid'

describe('effectiveTransactions', () => {

  describe('CREATE', () => {

    it('effective', () => {
      const transaction = createTransaction('CREATE')
      const transactions = [transaction]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(true)
    })
  })

  describe('SET', () => {

    it('only last effective', () => {
      const transaction0 = createTransaction('SET')
      const transaction1 = createTransaction('SET')
      const transactions = [transaction0, transaction1]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(false)
      expect(effectiveTransactions[1].effective).toBe(true)
    })
  })

  describe('CHILDREN', () => {

    it('REMOVE_CHILD, ADD_CHILD cancel each other out', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('REMOVE_CHILD', uuid, undefined, uuid1)
      const transactions = [transaction0, transaction1]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(false)
      expect(effectiveTransactions[1].effective).toBe(false)
    })

    it('ADD_CHILD', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('ADD_CHILD', uuid, undefined, uuid2)
      const transactions = [transaction0, transaction1]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(true)
      expect(effectiveTransactions[1].effective).toBe(true)
    })

    it('multiple', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('ADD_CHILD', uuid, undefined, uuid2)
      const transaction2 = createTransaction('ADD_CHILD', uuid, undefined, uuid3)
      const transaction3 = createTransaction('REMOVE_CHILD', uuid, undefined, uuid3)
      const transactions = [transaction0, transaction1, transaction2, transaction3]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(true)
      expect(effectiveTransactions[1].effective).toBe(true)
      expect(effectiveTransactions[2].effective).toBe(false)
      expect(effectiveTransactions[3].effective).toBe(false)
    })
  })

  describe('REVERT', () => {

    it('not effective', () => {
      const transaction = createTransaction('REVERT', uuid, undefined, undefined, uuid)
      const transactions = [transaction]
      const effectiveTransactions = setTransactionsEffective(transactions)
      expect(effectiveTransactions[0].effective).toBe(false)
    })
  })
})
