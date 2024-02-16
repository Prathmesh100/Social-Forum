// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

const {createResource,updateResources,deleteResource,getResource}= require("../controllers/Resourses")
const {createQuiz,updateQuiz,deleteQuiz,getQuiz} = require("../controllers/Quiz");
const {createBlog,updateBlog,deleteBlog,getBlog}= require("../controllers/Blogs");



router.post("/createResource", createResource);
router.put("/updateResource", updateResources);
router.delete("/deleteResource", deleteResource);
router.get("/getResource", getResource);

router.post("/createQuiz", createQuiz);
router.put("/updateQuiz", updateQuiz);
router.delete("/deleteQuiz", deleteQuiz);
router.get("/getQuiz", getQuiz);

router.post("/createBlog", createBlog);
router.put("/updateBlog", updateBlog);
router.delete("/deleteBlog", deleteBlog);
router.get("/getBlog", getBlog);

module.exports = router; 