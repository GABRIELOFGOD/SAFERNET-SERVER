const jwt = require('jsonwebtoken');
const Admin = require('../model/administrator.model');
const cloudinary = require('../config/cloudinary.config');
const { blogCreator } = require('../utils/creator');
const { blogChecker, allBlogs, singleBlog, blogDeleter, blogUpdater } = require('../utils/dbChecker');

const blogPoster = async (req, res) => {
    const {title, body} = req.body;
    try {
        
        if(!body || body.length <= 2) return res.status(402).json({error: 'Add contents to your blog', success: false})

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

            } else {
                            
                const theBlog = {
                    title,
                    body,
                    image: '',
                    postedBy: userAdmin.name,
                    posterId: userAdmin._id
                }

                const newBlog = await blogCreator(theBlog);
                res.status(201).json({message: 'Blog created successfully', newBlog})
            }

        })
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

const oneBlog = async (req, res) => {
    const {id} = req.params;
    try {

        if(!id) return res.status(401).json({error: 'Kindly add an id parameter to search for the blog', success: false})
        
        const theBlog = await singleBlog(id)

        if(!theBlog) return res.status(401).json({error: 'No Blog found', success: false});

        res.status(201).json({theBlog});

    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

const deleteBlog = async (req, res) => {
    const {id} = req.params;
    try {

        if(!id) return res.status(401).json({error: 'Kindly add an id parameter to search for the blog', success: false})
        
        const theBlog = await blogDeleter(id)

        if(!theBlog) return res.status(401).json({error: 'No Blog found', success: false});

        res.status(203).json({message: 'Blog deleted successfully', success: true})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

const updateBlog = async (req, res, image) => {
    const {id} = req.params;
    const {body, title} = req.body;
    try {

        if(!id) return res.status(401).json({error: 'Kindly add an id parameter to search for the blog', success: false})

        if(!body) return res.status(401).json({error: 'Kindly add details to be updated in the blog.', success: false});

        if(req.file){
            let imageResult = await cloudinary.uploader.upload(req.file.path, async (err, rsult) => {
                if(err) return res.status(401).json({error: 'There was an error while trying to update your image', success: false, errLog: err})
                
                const result = {title, body, image: rsult.secure_url}

                const updatedBlog = await blogUpdater(id, result)

                res.status(202).json({message: 'Blog updated successfully', success: true})
            })
            
        } else {
            
            const theBlog = await singleBlog(id)

            const result = {title, body, image: theBlog.image}

            const updatedBlog = await blogUpdater(id, result)

            res.status(202).json({message: 'Blog updated successfully', success: true})
        }
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

module.exports = {blogPoster, getBlogs, oneBlog, deleteBlog, updateBlog}