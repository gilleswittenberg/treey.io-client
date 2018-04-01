export default (dataAdd, dataRemove) => {

  const actions = {
    clearUIEditingAdding: () => {
      dataAdd({
        ui: {
          editing: null,
          adding: null
        }
      })
    },
    setUIEditing: nodeId => {
      dataAdd({
        ui: {
          editing: nodeId
        }
      })
    },
    setUIAdding: nodeId => {
      dataAdd({
        ui: {
          adding: nodeId
        }
      })
    },
    setUIExpanded: treePath => {
      dataAdd(null, 'ui.expanded.[]', treePath)
    },
    unsetUIExpanded: index => {
      dataRemove(`ui.expanded.${ index }`)
    },
    setUIDragging: nodeId => {
      dataAdd({
        ui: {
          dragging: nodeId
        }
      })
    },
    clearUIDragging: () => {
      dataAdd({
        ui: {
          dragging: null
        }
      })
    },
    setUIMovingChild: nodeId => {
      dataAdd({
        ui: {
          movingChild: nodeId
        }
      })
    },
    clearUIMovingChild: () => {
      dataAdd({
        ui: {
          movingChild: null
        }
      })
    },
    setUIActive: treePath => {
      dataAdd({
        ui: {
          active: treePath
        }
      })
    },
    setUIButtonsShown: nodeId => {
      dataAdd({
        ui: {
          buttonsShown: nodeId
        }
      })
    },
    clearUIButtonsShown: () => {
      dataAdd({
        ui: {
          buttonsShown: null
        }
      })
    }
  }

  return actions
}
