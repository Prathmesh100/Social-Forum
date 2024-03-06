const resource = require("../models/Resourses");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { uploadPDFToCloudinary } = require("../utils/pdfUploader");

require("dotenv").config();

// function to create a new resource

exports.createResource = async (req,res)=>{
    try{
        const {title,category,resourceType,link} =req.body;
       
        if(!title || !category || !resourceType) 
        {
            return res.status(400).json({
                success:false,
                message: "All fields are required"
            });
        }
        console.log(resourceType);
        console.log("all fields are required complete");
        if(resourceType==="link")
        {
            if(!link)
            {
                return res.status(400).json({
                    success:false,
                    message: "link required"
                });
            }
            //create a new Resource object with given data
            const newResource= await resource.create({
                title,
                resourseUrl: link,
                category:category,
                resourceType:resourceType,
    
            });
    
            // Return the response
            res.status(200).json({
                success: true,
                data: newResource,
                message: "Resource data inserted in DB Successfully",
            });
     
        }
        else
        {   const file = req.files.resourceFile;
            // check if any of requird fields are missing
            if(!file)
            {
                return res.status(400).json({
                    success:false,
                    message:"resourceFile required"
                })
            }
            const fileType = file?.name.split('.')[1];
            let resourceData = null;
            if(fileType==="pdf"){
                resourceData= await uploadPDFToCloudinary(
                    file,
                    process.env.FOLDER_NAME
                );
                    // console.log("pdf upload", resourceData);
            }
            else{
                resourceData= await uploadImageToCloudinary(
                    file,
                    process.env.FOLDER_NAME
                );
                    // console.log("image upload", resourceData);
            }

            // create a new Resource object with given data
            const newResource= await resource.create({
                title,
                resourseUrl: resourceData?.secure_url,
                category:category,
                resourceType:resourceType

            });

            // Return the response
            res.status(200).json({
                success: true,
                data: newResource,
                message: "Resource data inserted in DB Successfully",
            });
    
        }

    }  
    catch (error) {
		// Handle any errors that occur during the creation of gallery image
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to insert Resource in DB",
			error: error.message,
		});
	}
}


// for updating resources data
exports.updateResources = async (req, res) => {
    try{
        // extracting resource id and information from request body
        const {id} = req.params
        const {title,category,resourceType,link} = req.body;
        if(!id )
        {   
            return res.status(400).json({
                success: false,
                message: "Resource ID required",
            })
        }
        if(!resourceType)
        {
            return res.status(400).json({
                success: false,
                message: "Resource data type requird",
            })
        }
        console.log("going to check if resource")
         // Check if resource exists
         const isResource = await resource.findById(id);
         if (!isResource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        } 
        if(resourceType ==='link')
        {
            const updatedResource = await resource.findByIdAndUpdate(id, {
                title: title || isResource?.title,
                category: category || isResource?.category,
                resourseUrl: link || isResource?.link,
                resourceType:resourceType
            }, { new: true });

            return res.status(200).json({
                success: true,
                data: updatedResource,
                message: "Resource title Updated in DB Successfully",
            });
        }
        // Check if file is uploaded
        if (!req.files || !req.files.resourceFile) {
            // No file uploaded, update only the title
            const updatedResource = await resource.findByIdAndUpdate(id, {
                title: title || isResource?.title,
                category: category || isResource?.category,
                resourceType:resourceType
            }, { new: true });

            return res.status(200).json({
                success: true,
                data: updatedResource,
                message: "Resource title Updated in DB Successfully",
            });
        }

        const file = req.files.resourceFile;
        console.log("file read")
        let resourceData = null;
        if(file){
            const fileType = file?.name.split('.')[1];
            if(fileType==="pdf"){
                resourceData= await uploadPDFToCloudinary(
                    file,
                    process.env.FOLDER_NAME
                );
                    // console.log("pdf upload", resourceData);
            }
            else{
                resourceData= await uploadImageToCloudinary(
                    file,
                    process.env.FOLDER_NAME
                );
                    // console.log("image upload", resourceData);
            }
        }

        // update the resource with necessary information
        const updatedResource= await resource.findByIdAndUpdate({_id:id},{
            title: title || isResource?.title,
            resourseUrl: resourceData?.secure_url || isResource?.resourseUrl,
            category: category || isResource?.category,
            resourceType:resourceType

        },{new: true});
 
        
        res.status(200).json({
			success: true,
			data: updatedResource, 
			message: "Resource data Updated in DB Successfully",
		});

    }
    catch (error) {
        // Handle any errors that occur during the creation of gallery image
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update Resource in DB",
            error: error.message,
        });
    }
}

// for deleting resources data
exports.deleteResource = async (req,res)=>{
  try{
        // extracting resource id and information from request body
        const {id} = req.params;
        console.log(req.params)
        if(!id)
        {   
            return res.status(400).json({
                success: false,
                message: "Resource ID required",
            })
        }
        console.log("going to check if resource")
         // Check if resource exists
         const ifResource = await resource.findById(id);
         if (!ifResource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        } 
        
        await resource.findByIdAndDelete({_id:id});
        res.status(200).json({
			success: true,
			message: "Resource data deleted in DB Successfully",
		});

    }
    catch (error) {
    // Handle any errors that occur during the creation of gallery image
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Failed to update Resource in DB",
        error: error.message,
        });
    }
}

exports.getResource = async (req,res)=>{
    try{
        const {id} = req.params;
        
        const Resource = await resource.find({_id:id},
			{
			})
            if(!Resource)
            {
                return res.status(400).json({
                    success:false,
                    message:"Resource not found"
                })
            }
            return res.status(200).json({
                success: true,
                data: Resource,
            });
    }
    catch (error) {
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Resource Data`,
			error: error.message,
		});
    }
}

// for getting resources data
exports.getAllResources = async (req,res)=>{
    try{
        const allResources = await resource.find()
            return res.status(200).json({
                success: true,
                data: allResources,
            });
    }
    catch (error) {
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Resource Data`,
			error: error.message,
		});
    }
}