const { urlValidator } = require("../utils/validator");
const cloudinary = require('../config/cloudinary.config');
const { mediaPhotoPoster } = require("../utils/creator");
const { allMediaPhoto, mediaPhotoExists, mediaPhotoTitle } = require("../utils/dbChecker");

const postMediaPhoto = async (req, res) => {
  const { title, link, desc } = req.body;
  try {

    const admin = req.admin;
    
    if(!title) return res.status(400).json({error: "The media photo must have a title. Hint: use the event title here", success: false});

    if(!link) return res.status(400).json({error: "Enter photo link here"});
    const isValidLink = urlValidator(link);
    
    if(!isValidLink) return res.status(400).json({error: "Input a valid link to a photo media.", success: false});

    const photoCheck = await mediaPhotoExists(link);      
    if(photoCheck) return res.status(400).json({error: `This media photo has been posted before now with the title: ${photoCheck.title}`, success: false});

    const titleCheck = await mediaPhotoTitle(title);
    if(titleCheck) return res.status(400).json({error: "There's a photo media posted with this same title before, kindly check and try again", success: false});

    if(!req.file) return res.status(400).json({error: "Add one of the media photo here as a cover photo", success: false});

    const coverPhoto = await cloudinary.uploader.upload(req.file.path).catch(flyerErr => {
      console.error('Error uploading flyer:', flyerErr);
      return res.status(500).json({ error: 'Error uploading flyer', success: false, errLog: flyerErr });
    });
    // blogData.image = coverPhoto.secure_url;

    const mediaPhotoPayload = {
      title,
      link,
      description: desc,
      cover: coverPhoto.secure_url,
      postedBy: admin.name
    }

    const poster = await mediaPhotoPoster(mediaPhotoPayload);
    res.status(200).json({message: 'Photo media posted successfully', success: true, data: poster});
    
  } catch (err) {
    res.status(500).json({ error: 'something went wrong check the error log or try again later', success: false, errLog: err });
  }
}

const getAllMediaPhoto = async (req, res) => {
  try {
    const mediaImages = await allMediaPhoto();
    res.json(mediaImages);
  } catch (err) {
    res.status(500).json({ error: 'something went wrong check the error log or try again later', success: false, errLog: err });  
  }
}

module.exports = { postMediaPhoto, getAllMediaPhoto };