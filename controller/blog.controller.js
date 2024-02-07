const jwt = require('jsonwebtoken');
const Admin = require('../model/administrator.model');
const cloudinary = require('../config/cloudinary.config');
const { blogCreator } = require('../utils/creator');
const { blogChecker, allBlogs } = require('../utils/dbChecker');

const blogPoster = async (req, res) => {
    const {title, body} = req.body;
    try {
        
        if(!body || body.length <= 2) return res.status(402).json({error: 'Add contents to your blog', success: false})

        const cookie = req.headers.cookie
        const cookieName = cookie.split('=')[0]
        const cookieToken = cookie.split('=')[1]

        if(cookieName !== 'SaferAdmin') return res.status(401).json({error: 'Authentication failed', success: false})
        jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
            if(err) return res.status(401).json({error: 'Authentication failed, please try again or login your account again', success: false, errLog: err})
            const {id} = decodedToken
            const userAdmin = await Admin.findById(id)
            if(!userAdmin) return res.status(401).json({error: 'Authentication Failed', success: false})

            // =========================== CHECKING IF BLOG EXISTS ======================== //
            const blogExists = await blogChecker(body)
            if(blogExists) return res.status(402).json({error: 'This Blog Already exists', success: false});

            // =================== CLOUDINARY CONFIGURATION ===================== //
            if(req.file){
                const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
                    if(err) return res.status(401).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});

                    const theBlog = {
                        title,
                        body,
                        image: result.secure_url,
                        postedBy: userAdmin.name,
                        posterId: userAdmin._id
                    }

                    const newBlog = await blogCreator(theBlog);
                    return res.status(201).json({message: 'Blog created successfully', newBlog})
                })

            }
            
            const theBlog = {
                title,
                body,
                image: '',
                postedBy: userAdmin.name,
                posterId: userAdmin._id
            }

            const newBlog = await blogCreator(theBlog);
            res.status(201).json({message: 'Blog created successfully', newBlog})
        })
        if(req.file) {

        }
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

const getBlogs = async (req, res) => {
    try {
        const getblogs = await allBlogs();
        res.json(getblogs)
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

module.exports = {blogPoster, getBlogs}