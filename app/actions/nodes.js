import 'whatwg-fetch'

export const INDEX_NODES = 'INDEX_NODES'
export function indexNodes () {
  return {
    type: INDEX_NODES
  }
}

export const GET_NODES = 'GET_NODES'
export function getNodes () {
  return function (dispatch, getState) {
    fetch('/nodes')
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        console.log(json)
      })
  }
}
