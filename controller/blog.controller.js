const jwt = require('jsonwebtoken');
const cheerio = require('cheerio');
const Admin = require('../model/administrator.model');
const cloudinary = require('../config/cloudinary.config');
const multer = require('multer');
const { blogCreator } = require('../utils/creator');
const { blogChecker, allBlogs, singleBlog, blogDeleter, blogUpdater, singleBlogTitle } = require('../utils/dbChecker');
const Blog = require('../model/blog.model');

// const blogPoster = async (req, res) => {
//     const {title, body} = req.body;
//     try {
        
//         if(!body || body.length <= 2) return res.status(402).json({error: 'Add contents to your blog', success: false})

//         const cookie = req.headers.cookie
//         if(!cookie) return res.status(401).json({error: 'Authentication failed, please try again or login your account again', success: false})
        
//         const cookieName = cookie.split('=')[0]
//         const cookieToken = cookie.split('=')[1]

//         if(cookieName !== 'SaferAdmin') return res.status(401).json({error: 'Authentication failed', success: false})
//         jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
//             if(err) return res.status(401).json({error: 'Authentication failed, please try again or login your account again', success: false, errLog: err})
//             const {id} = decodedToken
//             const userAdmin = await Admin.findById(id)
//             if(!userAdmin) return res.status(401).json({error: 'Authentication Failed', success: false})

//             // =========================== CHECKING IF BLOG EXISTS ======================== //
//             const blogExists = await blogChecker(body)
//             if(blogExists) return res.status(402).json({error: 'This Blog Already exists', success: false});

//             // =================== CLOUDINARY CONFIGURATION ===================== //
//             if(req.file){
//                 const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
//                     if(err) return res.status(401).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});

//                     const theBlog = {
//                         title,
//                         body,
//                         image: result.secure_url,
//                         postedBy: userAdmin.name,
//                         posterId: userAdmin._id
//                     }

//                     const newBlog = await blogCreator(theBlog);
//                     return res.status(201).json({message: 'Blog created successfully', newBlog})
//                 })

//             } else {
                            
//                 const theBlog = {
//                     title,
//                     body,
//                     image: '',
//                     postedBy: userAdmin.name,
//                     posterId: userAdmin._id
//                 }

//                 const newBlog = await blogCreator(theBlog);
//                 res.status(201).json({message: 'Blog created successfully', newBlog})
//             }

//         })
//     } catch (err) {
//         res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
//     }
// }

// const blogPoster = async (req, res) => {
//     const { title, body } = req.body;
//     try {
//       if (!body || body.length <= 2) {
//         return res.status(402).json({ error: 'Add contents to your blog', success: false });
//       }
  
//       const cookie = req.headers.cookie;
//       if (!cookie) {
//         return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false });
//       }
  
//       const cookieName = cookie.split('=')[0];
//       const cookieToken = cookie.split('=')[1];
  
//       if (cookieName !== 'SaferAdmin') {
//         return res.status(401).json({ error: 'Authentication failed', success: false });
//       }
  
//       jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
//         if (err) {
//           return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false, errLog: err });
//         }
  
//         const { id } = decodedToken;
//         const userAdmin = await Admin.findById(id);
//         if (!userAdmin) {
//           return res.status(401).json({ error: 'Authentication Failed', success: false });
//         }
  
//         // Check if the blog already exists
//         const blogExists = await blogChecker(body);
//         if (blogExists) {
//           return res.status(402).json({ error: 'This Blog Already exists', success: false });
//         }
  
//         // Extract images from the body and upload to Cloudinary
//         const $ = cheerio.load(body);
//         const imagePromises = [];
//         $('img').each((index, img) => {
//           const src = $(img).attr('src');
//           if (src.startsWith('data:image/')) {
//             const uploadPromise = cloudinary.uploader.upload(src, { upload_preset: 'blog_images' });
//             imagePromises.push(uploadPromise);
//           }
//         });
  
//         const imageResults = await Promise.all(imagePromises);
//         $('img').each((index, img) => {
//           const src = $(img).attr('src');
//           if (src.startsWith('data:image/')) {
//             const imageUrl = imageResults.shift().secure_url;
//             $(img).attr('src', imageUrl);
//           }
//         });
  
//         const updatedBody = $.html();
  
//         const blogData = {
//           title,
//           body: updatedBody,
//           image: '',
//           postedBy: userAdmin.name,
//           posterId: userAdmin._id,
//         };
  
//         // Handle blog flyer if provided
//         if (req.file) {
//           const flyerResult = await cloudinary.uploader.upload(req.file.path);
//           blogData.image = flyerResult.secure_url;
//         }
  
//         const newBlog = await blogCreator(blogData);
//         res.status(201).json({ message: 'Blog created successfully', newBlog });
//       });
//     } catch (err) {
//       res.status(401).json({ error: 'something went wrong check the error log or try again later', success: false, errLog: err });
//     }
//   };

const storage = multer.diskStorage({
filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
},
});
const upload = multer({ storage });


const blogPoster = async (req, res) => {
    const { title, body } = req.body;
    try {
      if (!body || body.length <= 2) {
        return res.status(402).json({ error: 'Add contents to your blog', success: false });
      }

      // console.log(req.headers)
  
      const cookie = req.headers.cookie;
      if (!cookie) {
        return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false });
      }
  
      const cookieName = cookie.split('=')[0];
      const cookieToken = cookie.split('=')[1];
  
      if (cookieName !== 'SaferAdmin') {
        return res.status(401).json({ error: 'Authentication failed', success: false });
      }
  
      jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false, errLog: err });
        }
  
        const { id } = decodedToken;
        const userAdmin = await Admin.findById(id);
        if (!userAdmin) {
          return res.status(401).json({ error: 'Authentication Failed', success: false });
        }
  
        const blogExists = await Blog.findOne({ body });
        if (blogExists) {
          return res.status(402).json({ error: 'This Blog Already exists', success: false });
        }
    
        const blogData = {
          title,
          body,
          image: '',
          postedBy: userAdmin.name,
          posterId: userAdmin._id,
        };
  
        if (req.file) {
          const flyerResult = await cloudinary.uploader.upload(req.file.path).catch(flyerErr => {
            console.error('Error uploading flyer:', flyerErr);
            return res.status(500).json({ error: 'Error uploading flyer', success: false, errLog: flyerErr });
          });
          blogData.image = flyerResult.secure_url;
        }
  
        const newBlog = await Blog.create(blogData);
        res.status(201).json({ message: 'Blog created successfully', newBlog });
      });
    } catch (err) {
      res.status(401).json({ error: 'something went wrong check the error log or try again later', success: false, errLog: err });
    }
  };
// const blogPoster = async (req, res) => {
//     const { title, body } = req.body;
//     try {
//       if (!body || body.length <= 2) {
//         return res.status(402).json({ error: 'Add contents to your blog', success: false });
//       }
  
//       const cookie = req.headers.cookie;
//       if (!cookie) {
//         return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false });
//       }
  
//       const cookieName = cookie.split('=')[0];
//       const cookieToken = cookie.split('=')[1];
  
//       if (cookieName !== 'SaferAdmin') {
//         return res.status(401).json({ error: 'Authentication failed', success: false });
//       }
  
//       jwt.verify(cookieToken, process.env.SAFERNET_SECRET_KEY, async (err, decodedToken) => {
//         if (err) {
//           return res.status(401).json({ error: 'Authentication failed, please try again or login your account again', success: false, errLog: err });
//         }
  
//         const { id } = decodedToken;
//         const userAdmin = await Admin.findById(id);
//         if (!userAdmin) {
//           return res.status(401).json({ error: 'Authentication Failed', success: false });
//         }
  
//         // Check if the blog already exists
//         const blogExists = await Blog.findOne({ body });
//         if (blogExists) {
//           return res.status(402).json({ error: 'This Blog Already exists', success: false });
//         }
  
//         // Extract images from the body and upload to Cloudinary
//         const $ = cheerio.load(body);
//         const imagePromises = [];
//         $('img').each((index, img) => {
//           const src = $(img).attr('src');
//           if (src.startsWith('data:image/')) {
//             const uploadPromise = cloudinary.uploader.upload(src, { upload_preset: 'blog_images' }).catch(uploadErr => {
//               console.error('Error uploading image:', uploadErr);
//               return null;
//             });
//             imagePromises.push(uploadPromise);
//           }
//         });
  
//         const imageResults = await Promise.all(imagePromises);
  
//         // Update image src in the body
//         $('img').each((index, img) => {
//           const src = $(img).attr('src');
//           if (src.startsWith('data:image/')) {
//             const imageResult = imageResults.shift();
//             if (imageResult) {
//               $(img).attr('src', imageResult.secure_url);
//             } else {
//               $(img).remove();
//             }
//           }
//         });
  
//         const updatedBody = $.html();
  
//         const blogData = {
//           title,
//           body: updatedBody,
//           image: '',
//           postedBy: userAdmin.name,
//           posterId: userAdmin._id,
//         };
  
//         // Handle blog flyer if provided
//         if (req.file) {
//           const flyerResult = await cloudinary.uploader.upload(req.file.path).catch(flyerErr => {
//             console.error('Error uploading flyer:', flyerErr);
//             return res.status(500).json({ error: 'Error uploading flyer', success: false, errLog: flyerErr });
//           });
//           blogData.image = flyerResult.secure_url;
//         }
  
//         const newBlog = await Blog.create(blogData);
//         res.status(201).json({ message: 'Blog created successfully', newBlog });
//       });
//     } catch (err) {
//       res.status(401).json({ error: 'something went wrong check the error log or try again later', success: false, errLog: err });
//     }
//   };
  

const getBlogs = async (req, res) => {
    try {
        const getblogs = await allBlogs();
        res.json(getblogs)
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}


const reverseUrlFormatter = url => {
    const formattedUrl = url.replace(/-/g, ' ');
    return formattedUrl;
};
  

const oneBlog = async (req, res) => {
  const {title} = req.params;
  try {

      if(!title) return res.status(401).json({error: 'Kindly add an id parameter to search for the blog', success: false});

      const newTitle = reverseUrlFormatter(title)
      
      const theBlog = await singleBlogTitle(newTitle).populate('comment');

      if(!theBlog) return res.status(401).json({error: 'No Blog found', success: false});

      res.status(201).json({theBlog});

  } catch (err) {omni
      console.log(err)
      res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
  }
}

const deleteBlog = async (req, res) => {
    const {id} = req.params;
    try {

        if(!id) return res.status(401).json({error: 'Kindly add an id parameter to search for the blog', success: false})
        
        const theBlog = await blogDeleter(id)

        if(!theBlog) return res.status(401).json({error: 'No Blog found', success: false});

        res.status(200).json({message: 'Blog deleted successfully', success: true})
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

// const imageUploader = async (req, res) => {
//   const { image } = req.body;  // Assuming `image` is a base64 or file path string

//   try {
//     // Prepare the FormData
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
//     formData.append("cloud_name", process.env.CLOUDINARY_CLOUD_NAME);

//     const fetchResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     const data = await fetchResponse.json();

//     if (fetchResponse.ok) {
//       console.log("response", data);
//       return res.status(200).json({ success: true, data });
//     } else {
//       console.log("error", data);
//       throw new Error(data.error.message || "Upload failed");
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Something went wrong. Please try again later.', success: false, errLog: err.message });
//   }
// };

// const uploadImage = async (imageFile) => {
//   try {
//     // Step 1: Request the signature from your server
//     const signatureResponse = await fetch('/generate-signature', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
//       }),
//     });
//     const { signature, timestamp, apiKey, cloudName, uploadPreset } = await signatureResponse.json();

//     // Step 2: Upload image to Cloudinary
//     const formData = new FormData();
//     formData.append('file', imageFile);  // Your image file here
//     formData.append('upload_preset', uploadPreset);
//     formData.append('timestamp', timestamp);
//     formData.append('api_key', apiKey);
//     formData.append('signature', signature);

//     const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     const cloudinaryData = await cloudinaryResponse.json();
//     if (cloudinaryResponse.ok) {
//       console.log('Upload successful:', cloudinaryData);
//       return cloudinaryData;
//     } else {
//       console.log('Cloudinary error:', cloudinaryData);
//     }
//   } catch (err) {
//     console.error('Error during upload:', err);
//   }
// };



module.exports = { blogPoster, getBlogs, oneBlog, deleteBlog, updateBlog, upload };