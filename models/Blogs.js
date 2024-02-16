// Import the Mongoose library
const mongoose = require("mongoose");

// Define the blogs schema using the Mongoose Schema constructor
const blogsSchema = new mongoose.Schema(
	{
        title: {
            type: String,
            required: true
          },
          thumbnail:{
            type: String,
            required: true
          },
          images: {
            type: [String],
            required: true
          },
          content: {
            type: String,
            required: true
          },
        // // Defined the user added this to the blogs
        // user:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: "user",
        // }
		
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the blogs schema, using the name "blogs"
module.exports = mongoose.model("blogs", blogsSchema);