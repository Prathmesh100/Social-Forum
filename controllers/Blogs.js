const blog = require("../models/Blogs");
const { uploadImageToCloudinary,deleteImageFromCloudinary } = require("../utils/imageUploader");

// Controller function to create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content,category } = req.body;
        let files = req.files; // Assuming files are uploaded in 'images' field

        // Validate request body
        if (!title || !content || !files || !files.images || !files.thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, Thumbnail , content, and images are required fields",
            });
        }

        const thumbnail= await uploadImageToCloudinary(files.thumbnail,process.env.FOLDER_NAME);

        // Upload images to Cloudinary
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

        // Create a new blog instance
        const newBlog = await blog.create({
            title: title || "title",
            thumbnail: thumbnail?.secure_url,
            images: uploadedImages,
            content:content || "content",
            category:category || "category",
        });


        res.status(200).json({
            success: true,
            data: newBlog,
            message: "Blog post created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create blog post",
            error: error.message,
        });
    }
};

// dummy
exports.createDummyBlog = async (req, res) => {
    try {
        const { title, content,category } = req.body;
        let files = req.files; // Assuming files are uploaded in 'images' field

        // Validate request body
        if (!title || !content || !files || !files.images || !files.thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, Thumbnail , content, and images are required fields",
            });
        }

        const thumbnail= await uploadImageToCloudinary(files.thumbnail,process.env.FOLDER_NAME);

        // Upload images to Cloudinary
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

        // Create a new blog instance
        const newBlog = await blog.create({
            title: title || "title",
            thumbnail: thumbnail?.secure_url,
            images: uploadedImages,
            content:content || "content",
            category:category || "category",
        });


        res.status(200).json({
            success: true,
            data: newBlog,
            message: "Blog post created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create blog post",
            error: error.message,
        });
    }
};

// Controller function to update a blog post
exports.updateBlog = async (req, res) => {
    try {
        const {id} = req.params
        const { title, content,category } = req.body;
        let files = req.files; // Assuming files are uploaded in 'images' field

        // Validate request body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required",
            });
        }

        // Find the blog post by ID
        const isBlog = await blog.findById(id);

        // Check if the blog post exists
        if (!isBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
        }

        // Check if files have been uploaded
        if (!files ) {
            // No files uploaded, update only the title and content
            const updatedBlog = await blog.findByIdAndUpdate(id, {
                title: title || isBlog.title,
                content: content || isBlog.content,
                category: category || isBlog.category,

            }, { new: true });

            return res.status(200).json({
                success: true,
                data: updatedBlog,
                message: "Blog updated successfully",
            });
        }

        let thumbnail = isBlog?.thumbnail;
        console.log(files.thumbnail)
        if(files.thumbnail){
            await deleteImageFromCloudinary(isBlog?.thumbnail);
            thumbnail= await uploadImageToCloudinary(files.thumbnail,process.env.FOLDER_NAME);
            thumbnail= thumbnail?.secure_url;

        }
        


        // // Delete earlier uploaded images from Cloudinary
        if(files.images)
        { await Promise.all(isBlog.images.map(async (earlierImage) => {
                try {
                    await deleteImageFromCloudinary(earlierImage);
                } catch (error) {
                    console.error("Error deleting earlier uploaded image from Cloudinary:", error);
                }
            }));
        }



        // // Upload new images to Cloudinary
        let uploadedImages=isBlog.images;
        if(files.images!==undefined && files.images.length > 1  )
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
        else if(files.images!==undefined)
        {
            const temp= await uploadImageToCloudinary(
                files.images,
                process.env.FOLDER_NAME
            );
            uploadedImages=temp?.secure_url;
        }

        // Update the blog post with the new data
        const updatedBlog = await blog.findByIdAndUpdate(id, {
            title: title || isBlog?.title,
            thumbnail: thumbnail,
            content: content || isBlog?.content,
            images: uploadedImages || isBlog.images,
            category: category || isBlog?.category,
        }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedBlog,
            message: "Blog updated successfully",
        });

    } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update blog post",
            error: error.message,
        });
    }
};


exports.deleteBlog = async (req,res)=>{
    try{
        const {id} = req.params;
        if(!id)
        {
            return res.status(404).json({
                success: false,
                message: "BlogId is required"
            })
        } 
        const isBlog= await blog.findById({_id:id});
        if(!isBlog)
        {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            })
        }
        await blog.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,  
            message: "Blog deleted successfully"
        })
    }
    catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to deleting blog post",
            error: error.message,
        });
    }
}


// for getting  blog data
exports.getBlog = async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from request parameters
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "BlogId is required",
            });
        }
        const foundBlog = await blog.findById(id); // Use findById to find blog by ID
        if (!foundBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: foundBlog,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Can't Fetch Blog Data",
            error: error.message,
        });
    }
};

// for getting All blog data
exports.getAllBlogs = async (req,res)=>{
    try{
        const allBlog = await blog.find();
        return res.status(200).json({
                success: true,
                data: allBlog,
            });
    }
    catch (error) {
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Blog Data`,
			error: error.message,
		});
    }
}
