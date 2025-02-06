const { v2: cloudinary } = require("cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to .env
  api_key: process.env.CLOUDINARY_API_KEY, // Add to .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add to .env
});

// Upload function
const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "products", // Organize uploads
    });
    return result.secure_url; // Return URL of the uploaded image
  } catch (error) {
    throw new Error("Cloudinary Upload Failed: " + error.message);
  }
};

module.exports = { uploadImage };
