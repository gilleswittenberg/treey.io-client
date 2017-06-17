/* @flow */

import type { HTTPMethod, FetchOptions } from '../../../flow/types'

export default function (method: HTTPMethod = 'GET', body?: any) : FetchOptions {
  const options: FetchOptions = {
    method,
    headers: {
      Accept: 'application/json'
    },
    credentials: 'include'
  }
  if (method === 'POST' || method === 'PUT') {
    options.headers['Content-Type'] = 'application/json'
  }
  if (body != null) {
    options.body = JSON.stringify(body)
  }
  return options
}
