const {uploadImageToCloudinary,deleteImageFromCloudinary} = require("../utils/imageUploader")

require("dotenv").config();

exports.imageUpload= async (req,res)=>{
    try{
        const file= req.files.image;
        if(!file){
            return res.status(400).json({
                success: false,
                message: "image required"
            })
        }
        const temp= await uploadImageToCloudinary(
            file,
            process.env.FOLDER_NAME
        );
        
        return res.status(200).json({
            success: true,
            data: temp?.secure_url,
            message: "image uploaded successfully"
        })
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to Upload image",
            error: error.message,
        });
    }
}
 

exports.imageRemover= async (req,res)=>{
    try{
        const {imageUrl}= req.body;
        if(!imageUrl){
            return res.status(400).json({
                success: false,
                message: "image required"
            })
        }
        await deleteImageFromCloudinary(imageUrl);
        return res.status(200).json({
            success: true,
          
            message: "image removed successfully"
        })
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete image",
            error: error.message,
        });
    }
}
 
