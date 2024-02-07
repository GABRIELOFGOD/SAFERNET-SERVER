const blogPoster = async (req, res) => {
    const {title, body} = req.body;
    try {
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

module.exports = {blogPoster}