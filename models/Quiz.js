// Import the Mongoose library
const mongoose = require("mongoose");

// Define the quiz schema using the Mongoose Schema constructor
const quizSchema = new mongoose.Schema(
	{
        question: {
            type: String,
            required: true
          },
          options: {
            type: [String],
            required: true
          },
          correctAnswer: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
       
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the quiz schema, using the name "quiz"
module.exports = mongoose.model("quiz", quizSchema);