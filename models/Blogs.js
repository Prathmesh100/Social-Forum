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
          category: {
            type: String,
            required: true
          }
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the blogs schema, using the name "blogs"
module.exports = mongoose.model("blogs", blogsSchema);