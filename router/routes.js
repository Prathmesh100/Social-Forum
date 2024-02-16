// Import the required modules
const express = require("express")
const router = express.Router()

const {isDemo}=require("../middlewares/demo");
const { auth } = require("../middlewares/auth")

// Import the Controllers

const {createResource,updateResources,deleteResource,getResource}= require("../controllers/Resourses")
const {createQuiz,updateQuiz,deleteQuiz,getQuiz} = require("../controllers/Quiz");
const {createBlog,updateBlog,deleteBlog,getBlog}= require("../controllers/Blogs");
const {signup,login} = require("../controllers/Auth")

router.post("/login",login)
router.post("/signup",signup)



router.post("/createResource", auth,isDemo, createResource);
router.put("/updateResource", auth,isDemo, updateResources);
router.delete("/deleteResource", auth,isDemo, deleteResource);
router.get("/getResource", getResource);

router.post("/createQuiz", auth,isDemo, createQuiz);
router.put("/updateQuiz", auth,isDemo, updateQuiz);
router.delete("/deleteQuiz", auth,isDemo, deleteQuiz);
router.get("/getQuiz",  getQuiz);                   

router.post("/createBlog", auth,isDemo, createBlog); 
router.put("/updateBlog", auth,isDemo, updateBlog);
router.delete("/deleteBlog", auth,isDemo, deleteBlog);
router.get("/getBlog",getBlog);

module.exports = router; 