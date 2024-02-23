// Import the required modules
const express = require("express")
const router = express.Router()

const {isDemo}=require("../middlewares/demo");
const { auth, isSuperAdmin } = require("../middlewares/auth")
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")
// Import the Controllers

const {createResource,updateResources,deleteResource,getResource}= require("../controllers/Resourses")
const {createQuiz,updateQuiz,deleteQuiz,getQuiz} = require("../controllers/Quiz");
const {createBlog,updateBlog,deleteBlog,getAllBlogs, getBlog}= require("../controllers/Blogs");
const {signup,login,changePassword,getUserDetails,updateUserDetails,getAllUserDetails,deleteUser,approveUser} = require("../controllers/Auth")


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post("/login",login)
router.post("/signup",signup)

// Route for getting User information
router.get("/getUserDetails",auth,isDemo, getUserDetails)
// Route for updating user details
router.post("/updateUserDetails",auth,isDemo,updateUserDetails)

// ********************************************************************************************************
//                                      Reset Password routes
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)
// Route for Changing the password
router.post("/changepassword", auth,isDemo, changePassword)

// ********************************************************************************************************
//                                      SuperAdmin special routes
// ********************************************************************************************************

// Route for fetching all user details (only accessible by SuperAdmin)
router.get("/getAllUsers",auth,isSuperAdmin,isDemo,getAllUserDetails)
// Route for Deleting a user (only accessible by SuperAdmin)
router.delete("/deleteUser",auth,isSuperAdmin,isDemo,deleteUser);
// Approve user to sign up or not
router.put("/approveUser",auth,isSuperAdmin,isDemo,approveUser);


// ********************************************************************************************************
//                                      Resources routes
// ********************************************************************************************************

// Routes for managing resources
router.post("/createResource", auth,isDemo, createResource);
router.put("/updateResource/:id", auth,isDemo, updateResources);
router.delete("/deleteResource/:id", auth,isDemo, deleteResource);
router.get("/getResource", getResource);

// ********************************************************************************************************
//                                      Quiz routes
// ********************************************************************************************************

// Routes for managing quizzes
router.post("/createQuiz", auth,isDemo, createQuiz);
router.put("/updateQuiz", auth,isDemo, updateQuiz);
router.delete("/deleteQuiz/:id", auth,isDemo, deleteQuiz);
router.get("/getQuiz",  getQuiz);                   


// ********************************************************************************************************
//                                      Blogs routes
// ********************************************************************************************************

// Routes for managing blogs
router.post("/createBlog", auth,isDemo, createBlog); 
router.put("/updateBlog/:id", auth,isDemo, updateBlog);
router.delete("/deleteBlog/:id", auth,isDemo, deleteBlog);
router.get("/getBlog/:id",getBlog);
router.get("/getAllBlogs",getAllBlogs);

module.exports = router; 