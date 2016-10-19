import 'whatwg-fetch'

const hostname = window.location.hostname
const host = process.env.NODE_ENV === 'production' ? 'http://api.kee.plus:8081' : `http://${ hostname }:8081`
const rootUid = '57bedc40e81b0620300d769a'

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
    const url = `${ host }/node/${ rootUid }`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          }
          return response.json()
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .then(json => dispatch(indexNodes(json)))
      .catch(() => {
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
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          }
          return response.json()
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .then(json => dispatch(addNode(parent, json)))
      .catch(() => dispatch(hasErrors()))
  }
}

export const UPDATE_NODE = 'UPDATE_NODE'
export function updateNode (uid, node) {
  return {
    type: UPDATE_NODE,
    data: {
      uid,
      node
    }
  }
}

export const PUT_NODE = 'PUT_NODE'
export function putNode (uid, data) {
  return function (dispatch) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ uid }`
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
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          }
          return response.json()
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .then(json => dispatch(updateNode(uid, json)))
      .catch(() => dispatch(hasErrors()))
  }
}

export const REMOVE_NODE = 'REMOVE_NODE'
export function removeNode (parent, uid) {
  return {
    type: REMOVE_NODE,
    data: {
      parent,
      uid
    }
  }
}

export const DELETE_NODE = 'DELETE_NODE'
export function deleteNode (parent, uid) {
  return function (dispatch) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ parent }/${ uid }`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          } else {
            dispatch(removeNode(parent, uid))
          }
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .catch(() => dispatch(hasErrors()))
  }
}

export const MOVE_NODE = 'MOVE_NODE'
export function moveNode (parent, uid, newParent, before) {
  return {
    type: MOVE_NODE,
    data: {
      parent,
      uid,
      newParent,
      before
    }
  }
}

export const PUT_MOVE_NODE = 'PUT_MOVE_NODE'
export function putMoveNode (parent, uid, newParent, before) {
  return function (dispatch) {
    dispatch(startSyncing())
    dispatch(moveNode(parent, uid, newParent, before))
    before = before || ''
    const url = `${ host }/node/move/${ parent }/${ uid }/${ newParent }/${ before }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          }
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .catch(() => dispatch(hasErrors()))
  }
}
