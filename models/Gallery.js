const mongoose = require("mongoose");


const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
          },
          images: {
            type: [String],
            required: true
          },
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
)

module.exports = mongoose.model("gallery", gallerySchema);