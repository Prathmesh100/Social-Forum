const carousel = require("../models/HomePageCarousel");
const { uploadImageToCloudinary,deleteImageFromCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Function to create a new gallery images
exports.createCarouselImage = async (req, res) => {
	try {
		
		// Get image from request files
		const image = req.files.carouselImage;
		console.log(image);
		// Check if any of the required fields are missing
		if (
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
		const newCarouselImage = await carousel.create({
			image: galleryImage.secure_url,
		});

		// Return the response
		res.status(200).json({
			success: true,
			data: newCarouselImage,
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

exports.updateCarouselImage = async (req, res) => {
    try{
        const {id} = req.params;
        const image = req.files.carouselImage;
        if(!id)
        {
            return res.status(400).json({
                success: false,
                message:"Id is required"
            })
        }
        const isCarousel= await carousel.findById({_id:id})
        if(!isCarousel)
        {
            return res.status(404).json({
                success: false,
                message:"Carousel image data not found"
            })
        }
            await deleteImageFromCloudinary(isCarousel?.image);
            let newImage= await uploadImageToCloudinary(image,process.env.FOLDER_NAME);
            newImage= newImage?.secure_url;

            const updatedCarousel = await carousel.findByIdAndUpdate({_id:id},{
                image:newImage
            },{ new: true })

            return res.status(200).json({
                success: true,
                message:"Carousel data updated successfully",
                data: updatedCarousel
            })

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


// Function to get getAllGalleryImage
exports.getAllCarouselImage = async (req,res)=>{
    try {
		const allCarousel = await carousel.find();
		res.status(200).json({
			success: true,
			data: allCarousel,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

exports.deleteCarouselImage= async (req,res)=>{
    try{
        const {id}= req.params;
        if(!id)
        {
            return res.status(400).json({
                success: false,
                message:"Id is required"
            })
        }
        const isCarouselImage= await carousel.findById({_id:id});
        if(!isCarouselImage)
        {
            return res.status(404).json({
                success: false,
                message:"Carousel Image data not found"
            })
        }
        await deleteImageFromCloudinary(isCarouselImage?.image);
        await carousel.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success: true,
            message:"Carousel image deleted successfully"
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