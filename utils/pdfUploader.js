const cloudinary = require('cloudinary').v2
require("dotenv").config();

exports.uploadPDFToCloudinary  = async (file, folder) => {
    const options = {folder};
    return await cloudinary.uploader.upload(file.tempFilePath, options);
} 