const cloudinary = require('./cloudinary.config');

const generateSignature = (req, res) => {
  const { uploadPreset, folder } = req.body; // folder is optional

  const timestamp = Math.round(new Date().getTime() / 1000); // Unix timestamp in seconds

  const paramsToSign = {
    upload_preset: uploadPreset,  // Must match the preset name in Cloudinary
    folder: folder || '',         // Optional: If you want to organize uploads into folders
    timestamp,
  };

  // Generate signature using Cloudinary API secret
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return res.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: uploadPreset, // Send this back to the client as well
  });
};

module.exports = { generateSignature };
