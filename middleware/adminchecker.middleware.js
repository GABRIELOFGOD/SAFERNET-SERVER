const jwt = require('jsonwebtoken')

const checkingForAdmin = (req, res, next) => {
    const cookie = req.headers.cookie;
    console.log('cookie', cookie)
    try {

        const cookieName = cookie.split('=')[0];
        const token = cookie.split('=')[1];
        
        if(cookieName !== 'SaferAdmin') return res.status(401).json({error: 'Authentication error', success: false})

        jwt.verify(token, process.env.SAFERNET_SECRET_KEY, (err, decodedToken) => {
            if(err) return res.status(401).json({error: 'Authentication error', success: false, errLog: err})

            req.user = decodedToken;
            next();
        })
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
        console.log(err)
    }
}

module.exports = {checkingForAdmin};