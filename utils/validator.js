const validator = require('validator')
const bcrypt = require('bcryptjs')

const emailValidator = (email) => validator.isEmail(email)

const phoneNumberValidator = phone => validator.isMobilePhone(phone)

const checkPassword = password => validator.isStrongPassword(password)

const salt = () => bcrypt.genSalt(10)

const passwordHash = (password, salted) => bcrypt.hash(password, salted)

const passwordCompare = (password, savedPassword) => bcrypt.compare(password, savedPassword)

const urlValidator = (url) => validator.isURL(url)

module.exports = {emailValidator, salt, passwordHash, passwordCompare, urlValidator, phoneNumberValidator, checkPassword}