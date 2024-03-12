const gallery = require("../models/Gallery");
const { uploadImageToCloudinary,deleteImageFromCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Function to create a new gallery images
exports.createGalleryImage = async (req, res) => {
	try {
		let {title} = req.body;
		// Get image from request files
        let files = req.files; // Assuming files are uploaded in 'images' field
		console.log(files);
		// Check if any of the required fields are missing
		if (
			!title ||
            !files.images
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		console.log("required done");

		let uploadedImages=[];
        if(files.images.length > 1)
        {
            uploadedImages = await Promise.all(files.images.map(async (file) => {
                try {
                    const imageUrl = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
                    return imageUrl.secure_url;
                } catch (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    throw new Error("Failed to upload image to Cloudinary");
                }
            }));
        }
        else 
        {
            const temp= await uploadImageToCloudinary(
                files.images,
                process.env.FOLDER_NAME
            );
            uploadedImages=temp?.secure_url;
        }
		console.log(" Image upload done");

		// console.log(galleryImage);
		// Create a new PastEvent with the given details
		const newGalleryImage = await gallery.create({
			title,
			images: uploadedImages,
		});

		// Return the response
		res.status(200).json({
			success: true,
			data: newGalleryImage,
			message: "Gallery created successfully",
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
        let files = req.files; // Assuming files are uploaded in 'images' field
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
        if(!files){
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
            { await Promise.all(isGallery.images.map(async (earlierImage) => {
                try {
                    await deleteImageFromCloudinary(earlierImage);
                    console.log("Image deleted successfully");
                } catch (error) {
                    console.error("Error deleting earlier uploaded image from Cloudinary:", error);
                }
                }));
            }

            let uploadedImages=isGallery.images;
            if(files.images.length > 1)
            {
                uploadedImages = await Promise.all(files.images.map(async (file) => {
                    try {
                        const imageUrl = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
                        console.log(imageUrl.secure_url)
                        return imageUrl.secure_url;
                    } catch (error) {
                        console.error("Error uploading image to Cloudinary:", error);
                        throw new Error("Failed to upload image to Cloudinary");
                    }
                }));
            }
            else 
            {
                const temp= await uploadImageToCloudinary(
                    files.images,
                    process.env.FOLDER_NAME
                );
                uploadedImages=temp?.secure_url;
                console.log(uploadedImages);
            }
            console.log(uploadedImages);
		console.log(" Image upload done");
            const updatedGallery = await gallery.findByIdAndUpdate({_id:id},{
                title:title || isGallery?.title,
                images:uploadedImages || isGallery.images,
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
        // await deleteImageFromCloudinary(isGallery?.images);
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

exports.getGallery = async (req,res)=>{
    try{
        const { id } = req.params; // Extract the ID from request parameters
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Gallery Id is required",
            });
        }
        const isGallery = await gallery.findById(id); // Use findById to find blog by ID
        if (!isGallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: isGallery,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Can't Fetch Gallery Data",
            error: error.message,
        });
    }
}