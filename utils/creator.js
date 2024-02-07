const jwt = require("jsonwebtoken");
const Admin = require("../model/administrator.model");

const adminCreator = (admin) => Admin.create(admin);

const createdToken = (id) => {return(jwt.sign({id}, process.env.SAFERNET_SECRET_KEY, {expiresIn: '3d'}))}

module.exports = {adminCreator, createdToken}