/* @flow */

const allowedKeys = {
  'ui.expanded' : {
    validation (value) {
      if (!Array.isArray(value)) {
        return false
      }
      return (value.filter(v => typeof v !== 'string')).length === 0
    }
  }
}

const keys = Object.keys(allowedKeys)

function isAllowedKey (key) {
  return keys.includes(key)
}

function isValid (key, value) {
  if (allowedKeys[key] && allowedKeys[key].validation) {
    return allowedKeys[key].validation(value)
  }
  return true
}

const Storage = {

  set (key: string, item: any) : bool {

    if (!isAllowedKey(key)) {
      return false
    }

    try {
      const value = JSON.stringify(item)
      window.localStorage.setItem(key, value)
      return true
    } catch (err) {
      return false
    }
  },

  get (key: string) : bool | any {

    if (!isAllowedKey(key)) {
      return false
    }

    let parsedValue

    try {
      const value = window.localStorage.getItem(key)
      parsedValue = value ? JSON.parse(value) : null
    } catch (err) {
      return false
    }

    if (parsedValue === null) {
      return false
    }

    return isValid(key, parsedValue) ? parsedValue : false
  },

  clear () : bool {
    try {
      window.localStorage.clear()
      return true
    } catch (err) {
      return false
    }
  }
}

export default Storage
export { keys }
