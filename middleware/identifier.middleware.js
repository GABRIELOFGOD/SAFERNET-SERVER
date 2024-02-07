const Admin = require("../model/administrator.model")

const adminIdentifier = async (req, res, next) => {
    const {id} = req.user;
    try {
        
        const userExists = await Admin.findById(id);
         if(!userExists) return res.status(401).json({error: 'authentication failed', success: false});

         req.admin = userExists;
         next();
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

module.exports = {adminIdentifier};