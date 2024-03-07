const gallery = require("../models/Gallery");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Function to create a new gallery images
exports.createGalleryImage = async (req, res) => {
	try {
		let {title} = req.body;
		// Get image from request files
		const image = req.files.galleryImage;
		console.log(image);
		// Check if any of the required fields are missing
		if (
			!title ||
            !image
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		console.log("required done");

		// Upload the Image to Cloudinary
		const galleryImage = await uploadImageToCloudinary(
			image,
			process.env.FOLDER_NAME
		);
		console.log(" Image upload done");

		console.log(galleryImage);
		// Create a new PastEvent with the given details
		const newGalleryImage = await gallery.create({
			title,
			Image: galleryImage.secure_url,
		});

		// Return the response
		res.status(200).json({
			success: true,
			data: newGalleryImage,
			message: "Image inserted in DB Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of gallery image
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to insert Image in DB",
			error: error.message,
		});
	}
};

exports.updateGalleryImage = async (req, res) => {
    try{
        const {id} = req.params;
        const {title} = req.body;
        const image = req.files.galleryImage;
        if(!id)
        {
            return res.status(400).json({
                success: false,
                message:"Id is required"
            })
        }
        const isGallery= await gallery.findById({_id:id})
        if(!isGallery)
        {
            return res.status(404).json({
                success: false,
                message:"Gallery data not found"
            })
        }
        if(!image){
            const updatedGallery = await gallery.findByIdAndUpdate({_id:id},{
                title:title || isGallery?.title,
            },{ new: true })

            return res.status(200).json({
                success: true,
                message:"Gallery data updated successfully",
                data: updatedGallery
            })
        }
        else{
            await deleteImageFromCloudinary(gallery?.image);
            let image= await uploadImageToCloudinary(image,process.env.FOLDER_NAME);
            image= image?.secure_url;

            const updatedGallery = await gallery.findByIdAndUpdate({_id:id},{
                title:title || isGallery?.title,
                image:image
            },{ new: true })

            return res.status(200).json({
                success: true,
                message:"Gallery data updated successfully",
                data: updatedGallery
            })

        }

    }
    catch(error){
        console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to update data in DB",
			error: error.message,
		});
    }
}


// Function to AllGalleryImage
exports.getAllGalleryImage = async (req,res)=>{
    try {
		const allGallery = await gallery.find();
		res.status(200).json({
			success: true,
			data: allGallery,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

exports.deleteGalleryImage= async (req,res)=>{
    try{
        const {id}= req.params;
        if(!id)
        {
            return res.status(400).json({
                success: false,
                message:"Id is required"
            })
        }
        const isGallery= await gallery.findById({_id:id});
        if(!isGallery)
        {
            return res.status(404).json({
                success: false,
                message:"Gallery data not found"
            })
        }
        await deleteImageFromCloudinary(isBlog?.thumbnail);
        await gallery.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success: true,
            message:"Gallery image deleted successfully"
        })
    }
    catch (error) {
        console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to delete data in DB",
			error: error.message,
		});
    }
}