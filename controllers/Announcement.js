const announcement = require("../models/Announcement")
const  {uploadImageToCloudinary, deleteImageFromCloudinary} = require("../utils/imageUploader")


exports.createAnnouncement = async (req,res)=>{
    try{
        const {title,description} = req.body;
        if(!title || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newAnnoumcement = await announcement.create({
            announcement:title,
            description:description,
        })

        res.status(200).json({
            success: true,
            data: newAnnoumcement,
            message: "Announcement created successfully",
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create announcement",
            error: error.message,
        });
    }
}

exports.updateAnnouncement = async(req, res) => {
    try{
        const {title, description} = req.body;
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Announcement Id is required"
            })
        }
        const isAnnouncement = await announcement.findById({_id: id});
        if(!isAnnouncement){
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            })
        }

        const updatedAnnouncement = await announcement.findByIdAndUpdate({_id:id},{
            announcement: title || isAnnouncement?.announcement,
            description: description || isAnnouncement?.description
        },{ new: true });
        
        return res.status(200).json({
            success:true,
            data: updatedAnnouncement,
            message: 'Updated announcement successfully'
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update announcement",
            error: error.message,
        });
    }
}

exports.getAnnouncement = async(req, res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Announcement Id is required"
            })
        }
        const isAnnouncement = await announcement.findById({_id: id});
        if(!isAnnouncement){
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            })
        }

        return res.status(200).json({
            success:true,
            data: isAnnouncement,
            message: ' announcement fetched successfully'
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch announcement",
            error: error.message,
        });
    }
}

exports.getAllAnnouncements= async (req, res) => {
    try{
        const allAnnouncements = await announcement.find();
        return res.status(200).json({
            success:true,
            data: allAnnouncements,
            message: "All announcement fetched successfully",
        })

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all announcement",
            error: error.message,
        });
    }
}

exports.deleteAnnouncement = async(req, res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Announcement Id is required"
            })
        }
        const isAnnouncement = await announcement.findById({_id: id});
        if(!isAnnouncement){
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            })
        }

       await announcement.findByIdAndDelete({_id:id});
        
        return res.status(200).json({
            success:true,
            message: "Announcement deleted successfully",
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete announcement",
            error: error.message,
        });
    }
}