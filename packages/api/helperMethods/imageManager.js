const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with the credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


/**
 * Uploads an image to Cloudinary cloud storage
 * @param {string} path - The file path of the image to upload
 * @param {string} name - The desired public ID/name for the uploaded image
 * @returns {Promise<string>} The secure URL of the uploaded image on Cloudinary
 */
const uploadImage = async (path, name) => {
  // Use Cloudinary's moderation add-on to check image content
  const result = await cloudinary.uploader.upload(path, {
    public_id: name,
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    // moderation: 'aws_rek' // AWS Rekognition for content moderation
  });

  // // Check moderation status
  // if (result.moderation && result.moderation.status === 'rejected') {
  //   // Delete the rejected image from Cloudinary
  //   await cloudinary.uploader.destroy(result.public_id);
  //   throw new BadRequestError('Image contains inappropriate content');
  // }

  return result.secure_url;
};

/**
 * Deletes an image from Cloudinary cloud storage
 * @param {string} name - The public ID/name of the image to delete
 * @returns {Promise<void>}
 */
const deleteImage = async (name) => {
  await cloudinary.uploader.destroy(`users_images/${name}`);
};

module.exports = { uploadImage, deleteImage };