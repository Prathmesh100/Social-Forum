// Import the Mongoose library
const mongoose = require("mongoose");

// Define the resources schema using the Mongoose Schema constructor
const resourcesSchema = new mongoose.Schema(
	{
        // Defined title of resources
		title:{
            type: 'string',
            required: true,
        },
        // Defined resource url of resources
        resourseUrl:{
            type: 'string',
            required: true,
        },
        category:{
            type: String,
            required: true,
          },
        resourceType:{
            type: String,
			required: true,
        }
		
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the resources schema, using the name "resources"
module.exports = mongoose.model("resources", resourcesSchema);