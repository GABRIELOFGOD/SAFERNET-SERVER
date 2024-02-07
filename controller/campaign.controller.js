const ourCampaign = async (req, res) => {
    const {title, content} = req.body;
    try {
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}