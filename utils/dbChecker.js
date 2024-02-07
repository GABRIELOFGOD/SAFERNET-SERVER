const Admin = require("../model/administrator.model");

const emailChecker = (email) => Admin.findOne({email});
const phoneChecker = (mobile) => Admin.findOne({mobile});

module.exports = {emailChecker, phoneChecker};