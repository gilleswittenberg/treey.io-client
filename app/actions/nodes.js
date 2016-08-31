import 'whatwg-fetch'

const host = PRODUCTION ? 'http://api.yeeyey.com' : 'http://localhost:8081'
const rootId = '57bedc40e81b0620300d769a'

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
    const url = `${ host }/node/${ rootId }`
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

export const ADD_NODE = 'ADD_NODE'
export function addNode (parent, node) {
  return {
    type: ADD_NODE,
    data: {
      node,
      parent
    }
  }
}

export const POST_NODE = 'POST_NODE'
export function postNode (data, parent) {
  return function (dispatch) {
    const url = `${ host }/node/${ parent }`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(response => response.json())
      .then(json => dispatch(addNode(parent, json)))
  }
}

export const UPDATE_NODE = 'UPDATE_NODE'
export function updateNode (id, node) {
  return {
    type: UPDATE_NODE,
    data: {
      id,
      node
    }
  }
}

export const PUT_NODE = 'PUT_NODE'
export function putNode (id, data) {
  return function (dispatch) {
    const url = `${ host }/node/${ id }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(response => response.json())
      .then(json => dispatch(updateNode(id, json)))
  }
}

export const REMOVE_NODE = 'REMOVE_NODE'
export function removeNode (parent, id) {
  return {
    type: REMOVE_NODE,
    data: {
      parent,
      id
    }
  }
}

export const DELETE_NODE = 'DELETE_NODE'
export function deleteNode (parent, id) {
  return function (dispatch) {
    const url = `${ host }/node/${ parent }/${ id }`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      }
    }
    fetch(url, options)
      .then(() => dispatch(removeNode(parent, id)))
  }
}
