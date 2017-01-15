module.exports = function (username) {
  const regex = /[a-zA-Z]{2,}/
  return typeof username === 'string' && regex.test(username)
}
