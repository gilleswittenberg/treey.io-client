import 'whatwg-fetch'

const host = PRODUCTION ? 'http://api.yeeyey.com' : 'http://localhost:8081'

export const INDEX_NODES = 'INDEX_NODES'
export function indexNodes (tree) {
  return {
    type: INDEX_NODES,
    data: {
      tree
    }
  }
}

export const GET_NODES = 'GET_NODES'
export function getNodes () {
  return function (dispatch) {
    const id = '57bedc40e81b0620300d769a'
    const url = `${ host }/node/${ id }`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(response => response.json())
      .then(json => dispatch(indexNodes(json)))
  }
}
