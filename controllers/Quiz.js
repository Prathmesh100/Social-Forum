const quiz = require("../models/Quiz");

// Controller function to create a quiz
exports.createQuiz = async (req, res) => {
    try {
        const { question, options, correctAnswer ,category} = req.body;

        // Validate request body
        if (!question || !options || !correctAnswer || options.length !== 4 || !category) {
            return res.status(400).json({
                success: false,
                message: "Question, options (array of 4), category and correct answer are required",
            });
        }

        // Create a new quiz instance
        const newQuiz = await quiz.create({
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            category: category
        });

        // Save the quiz to the database
       
        res.status(200).json({
            success: true,
            data: newQuiz,
            message: "Quiz created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create quiz",
            error: error.message,
        });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const { question, options, correctAnswer,category} = req.body;
        const {id} = req.params
        // Validate request body
        if (!id ) {
            return res.status(400).json({
                success: false,
                message: "Question Id is required",
            });
        }

        const isQuestion = await quiz.findById({_id: id});
        if(!isQuestion) {
            return res.status(400).json({
                success: false,
                message:"Question not found"
            })
        }

        const updatedQuiz = await quiz.findByIdAndUpdate({_id: id},{
            question: question || isQuestion?.question,
            options: options || isQuestion?.options,
            correctAnswer: correctAnswer || isQuestion?.correctAnswer,
            category: category || isQuestion?.category,
        },{new: true});

        return res.status(200).json({
            success:true,
            data: updatedQuiz,
            message:"Question updated successfully"
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update quiz",
            error: error.message,
        });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate request body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Question Id is required",
            });
        }

       await quiz.findByIdAndDelete({_id: id});
        

        return res.status(200).json({
            success:true,
            message:"Question deleted successfully"
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete quiz",
            error: error.message,
        });
    }
};

// for getting quiz data
exports.getQuiz = async (req,res)=>{
    try{
        const {id} = req.params;
        
        const Quiz = await quiz.find({_id:id},
			{
				question: true,
                options:true,
                correctAnswer:true,
                category:true,
			})
            if(!Quiz)
            {
                return res.status(400).json({
                    success:false,
                    message:"Quiz not found"
                })
            }
            return res.status(200).json({
                success: true,
                data: Quiz,
            });
    }
    catch (error) {
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Quiz Data`,
			error: error.message,
		});
    }
}

// for getting all quiz data
exports.getAllQuizes = async (req,res)=>{
    try{
        const allQuiz = await quiz.find({},
			{
				question: true,
                options:true,
                correctAnswer:true,
                category:true,
			})
            return res.status(200).json({
                success: true,
                data: allQuiz,
            });
    }
    catch (error) {
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Quiz Data`,
			error: error.message,
		});
    }
}