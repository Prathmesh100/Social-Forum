// Import the Mongoose library
const mongoose = require("mongoose");

// Define the announcement schema using the Mongoose Schema constructor
const announcementSchema = new mongoose.Schema(
	{
        announcement: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          }
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the announcement schema, using the name "announcement"
module.exports = mongoose.model("announcements", announcementSchema);