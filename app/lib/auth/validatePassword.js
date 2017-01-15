module.exports = function (password) {
  return typeof password === 'string' && password.length >= 8
}
