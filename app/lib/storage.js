const storage = {

  set (key, item) {
    const value = JSON.stringify(item)
    window.localStorage.setItem(key, value)
  },

  get (key) {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }
}

export default storage
