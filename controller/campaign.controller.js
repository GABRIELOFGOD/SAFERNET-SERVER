const jwt = require('jsonwebtoken')
const { checkCampaign, campaginGetter } = require("../utils/dbChecker");
const { campaignCreator } = require('../utils/creator');
const Admin = require('../model/administrator.model');
const cloudinary = require('../config/cloudinary.config')

const ourCampaignPost = async (req, res) => {
    const { title, about } = req.body;
    try {

        if(!title) return res.status(401).json({error: 'Your campaign must have title', success: false});

        if(!req.file) return res.status(401).json({error: 'Your campaign must have an image or a flyer', success: false})
        
        const campaignExists = await checkCampaign(title);
        if(campaignExists) return res.status(401).json({error: 'This campaign has already been posted', success: false});

        
        const cookie = req.headers.cookie
        if(!cookie) return res.status(401).json({error: 'Authentication failed, please try again or login your account again', success: false})
        
        const cookieName = cookie.split('=')[0]
        const cookieToken = cookie.split('=')[1]


        if(cookieName !== 'SaferAdmin') return res.status(401).json({error: 'Authentication failed', success: false})
        jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
            if(err) return res.status(401).json({error: 'Authentication failed, please try again or login your account again', success: false, errLog: err})
            const {id} = decodedToken
            const userAdmin = await Admin.findById(id)
            if(!userAdmin) return res.status(401).json({error: 'Authentication Failed', success: false})
            // =========================== CHECKING IF BLOG EXISTS ======================== //
            // const blogExists = await blogChecker(body)
            // if(blogExists) return res.status(402).json({error: 'This Blog Already exists', success: false});

            // =================== CLOUDINARY CONFIGURATION ===================== //
            if(req.file){
                const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
                    if(err) return res.status(401).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});

                    const theBlog = {
                        title,
                        body: about,
                        image: result.secure_url
                    }

                    const newCamp = await campaignCreator(theBlog);
                    return res.status(201).json({message: 'campaign created successfully', newCamp})
                })

            } else {
                
                const theBlog = {
                    title,
                    body: about,
                    image: ''
                }

                const newBlog = await campaignCreator(theBlog);
                res.status(201).json({message: 'campaign created successfully', newBlog})
            }
            
        })
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

const getCampaign = async(req, res) => {
    try {
        
        const allCampaign = await campaginGetter();
        res.status(201).json({allCampaign})
    } catch (err) {
        res.status(401).json({error: 'Error occur while Fetching Campaigns check the error log or try again later', success: false, errLog: err});
    }
}

module.exports = {ourCampaignPost, getCampaign};