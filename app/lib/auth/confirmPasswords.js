module.exports = function (password, passwordConfirm) {
  return typeof password === 'string' && typeof passwordConfirm === 'string' && password === passwordConfirm
}
