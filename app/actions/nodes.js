import 'whatwg-fetch'

const hostname = window.location.hostname
const host = process.env.NODE_ENV === 'production' ? 'http://api.kee.plus:8081' : `http://${ hostname }:8081`
const rootId = '57bedc40e81b0620300d769a'

export const START_SYNCING = 'START_SYNCING'
export function startSyncing () {
  return {
    type: START_SYNCING
  }
}

export const STOP_SYNCING = 'STOP_SYNCING'
export function stopSyncing () {
  return {
    type: STOP_SYNCING
  }
}

export const HAS_ERRORS = 'HAS_ERRORS'
export function hasErrors () {
  return {
    type: HAS_ERRORS
  }
}

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
    dispatch(startSyncing())
    const url = `${ host }/node/${ rootId }`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => response.json(),
        () => { throw 'hasErrors' }
      )
      .then(json => {
        dispatch(stopSyncing())
        dispatch(indexNodes(json))
      })
      .catch(() => {
        dispatch(stopSyncing())
        dispatch(hasErrors())
      })
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
export function postNode (parent, data) {
  return function (dispatch) {
    dispatch(startSyncing())
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
      .then(
        response => response.json(),
        () => { throw 'hasErrors'}
      )
      .then(json => {
        dispatch(stopSyncing())
        dispatch(addNode(parent, json))
      })
      .catch(() => {
        dispatch(stopSyncing())
        dispatch(hasErrors())
      })
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
    dispatch(startSyncing())
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
      .then(
        response => response.json(),
        () => { throw 'hasErrors' }
      )
      .then(json => {
        dispatch(stopSyncing())
        dispatch(updateNode(id, json))
      })
      .catch(() => {
        dispatch(stopSyncing())
        dispatch(hasErrors())
      })
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
    dispatch(startSyncing())
    const url = `${ host }/node/${ parent }/${ id }`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        () => {
          dispatch(stopSyncing())
          dispatch(removeNode(parent, id))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const MOVE_NODE_2 = 'MOVE_NODE_2'
export function moveNode2 (parent, id, newParent, before) {
  return {
    type: MOVE_NODE_2,
    data: {
      parent,
      id,
      newParent,
      before
    }
  }
}

export const MOVE_NODE = 'MOVE_NODE'
export function moveNode (parent, id, newParent, before) {
  return function (dispatch) {
    dispatch(startSyncing())
    dispatch(moveNode2(parent, id, newParent, before))
    before = before || ''
    const url = `${ host }/node/move/${ parent }/${ id }/${ newParent }/${ before }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        () => dispatch(stopSyncing()),
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}
