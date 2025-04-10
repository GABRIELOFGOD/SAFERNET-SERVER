const jwt = require('jsonwebtoken')
const { checkCampaign, campaginGetter, oneCampaign, getFellowById } = require("../utils/dbChecker");
const { campaignCreator, createCampaign } = require('../utils/creator');
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

const singleCampagin = async (req, res) => {
    const {id} = req.params;
    try {
        
        if(!id) return res.status(401).json({error: 'There is no id passed to be search for', success: false})

        const theCampaign = await oneCampaign(id);

        if(!theCampaign) return res.status(401).json({error: 'No campaign found', success: false});

        res.status(201).json({message: 'Campaign fetched', success: true, data: theCampaign});
    } catch (err) {
        res.status(401).json({error: 'Error occur while Fetching Campaigns check the error log or try again later', success: false, errLog: err});
    }
}

const fellowPostCampaign = async (req, res) => {
    try {
      const { location, body } = req.body;
      const { id } = req.fellow;
  
      const fellow = await getFellowById(id);
      if (!fellow) return res.status(401).json({ error: 'You are not a fellow, please contact support', success: false });
  
      if (!location || !body) {
        return res.status(401).json({ error: 'Your campaign must have a location and body', success: false });
      }
  
      if (!req.files || req.files.length < 1) {
        return res.status(401).json({ error: 'Your campaign must have at least one image', success: false });
      }
  
      const campaignExists = await checkCampaign(body);
      if (campaignExists) return res.status(401).json({ error: 'This campaign has already been posted', success: false });
  
      const uploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'campaigns'
        });
      });
  
      const uploadedImages = await Promise.all(uploadPromises);
  
      const imageLinks = uploadedImages.map(img => img.secure_url);
  
      const newCampaign = await createCampaign({
        location,
        body,
        images: imageLinks,
        postedBy: fellow._id
      });
  
      res.status(200).json({
        success: true,
        message: 'Campaign posted successfully',
        data: newCampaign
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error occurred while posting campaign. Please try again.',
        errLog: error
      });
    }
  };

module.exports = { ourCampaignPost, getCampaign, singleCampagin, fellowPostCampaign };