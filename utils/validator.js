const validator = require('validator')
const bcrypt = require('bcryptjs')

const emailValidator = (email) => validator.isEmail(email)

const salt = () => bcrypt.genSalt(10)

const passwordHash = (password, salted) => bcrypt.hash(password, salted)

const passwordCompare = (password, savedPassword) => bcrypt.compare(password, savedPassword)

const urlValidator = (url) => validator.isURL(url)

module.exports = {emailValidator, salt, passwordHash, passwordCompare, urlValidator}