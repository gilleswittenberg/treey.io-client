const localStorageMock = (() => {

  let store = {}

  return {

    getItem (key) {
      return store[key]
    },

    setItem (key, value) {
      store[key] = value.toString()
    },

    clear () {
      store = {}
    }
  }
})()

Reflect.defineProperty(window, 'localStorage', { value: localStorageMock })
