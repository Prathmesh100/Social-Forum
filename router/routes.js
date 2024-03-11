// Import the required modules
const express = require("express")
const router = express.Router()

const {isDemo}=require("../middlewares/demo");
const { auth, isSuperAdmin } = require("../middlewares/auth")
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")
// Import the Controllers

const {createResource,updateResources,deleteResource,getAllResources,getResource}= require("../controllers/Resourses")
const {createQuiz,updateQuiz,deleteQuiz,getAllQuizes,getQuiz} = require("../controllers/Quiz");
const {createBlog,updateBlog,deleteBlog,getAllBlogs, getBlog,createDummyBlog}= require("../controllers/Blogs");
const {signup,login,changePassword,getUserDetails,updateUserDetails,getAllUserDetails,deleteUser,approveUser} = require("../controllers/Auth");
const { imageUpload, imageRemover } = require("../controllers/ImageUploader");
const {createAnnouncement,updateAnnouncement,getAllAnnouncements,getAnnouncement,deleteAnnouncement} = require("../controllers/Announcement");
const {createGalleryImage,updateGalleryImage,getAllGalleryImage,deleteGalleryImage,getGallery}= require("../controllers/Gallery");
const {createCarouselImage,updateCarouselImage,deleteCarouselImage,getAllCarouselImage} = require("../controllers/Carousel")

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post("/login",login)
router.post("/signup",signup)

// Route for getting User information
router.get("/getUserDetails",auth,isDemo, getUserDetails)
// Route for updating user details
router.put("/updateUserDetails",auth,isDemo,updateUserDetails)

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
                                                                 router.delete("/deleteUser/:id",auth,isSuperAdmin,isDemo,deleteUser);
// Approve user to sign up or not
router.put("/approveUser",auth,isSuperAdmin,isDemo,approveUser);


// ********************************************************************************************************
//                                      Resources routes
// ********************************************************************************************************

// Routes for managing resources
router.post("/createResource", auth,isDemo, createResource);
router.put("/updateResource/:id", auth,isDemo, updateResources);
router.delete("/deleteResource/:id", auth,isDemo, deleteResource);
router.get("/getResource/:id", getResource);
router.get("/getAllResources", getAllResources);

// ********************************************************************************************************
//                                      Quiz routes
// ********************************************************************************************************

// Routes for managing quizzes
router.post("/createQuiz", auth,isDemo, createQuiz);
router.put("/updateQuiz/:id", auth,isDemo, updateQuiz);
router.delete("/deleteQuiz/:id", auth,isDemo, deleteQuiz);
router.get("/getQuiz/:id",  getQuiz);    
router.get("/getAllQuizes",getAllQuizes)               


// ********************************************************************************************************
//                                      Blogs routes
// ********************************************************************************************************

// Routes for managing blogs
router.post("/createBlog", auth,isDemo, createBlog); 
router.put("/updateBlog/:id", auth,isDemo, updateBlog);
router.delete("/deleteBlog/:id", auth,isDemo, deleteBlog);
router.get("/getBlog/:id",getBlog);
router.get("/getAllBlogs",getAllBlogs);
router.post("/createDummyBlog", createDummyBlog);
router.post("/uploadBlogImage",auth,isDemo, imageUpload);
router.post("/removeBlogImage",auth,isDemo, imageRemover);

// ********************************************************************************************************
//                                      Announcement routes
// ********************************************************************************************************

// Routes for managing announcements
router.post('/createAnnouncement',auth,isDemo,createAnnouncement);
router.put('/updateAnnouncement/:id',auth,isDemo,updateAnnouncement);
router.get('/getAllannouncements', getAllAnnouncements);
router.get('/getAnnouncement/:id',getAnnouncement);
router.delete('/deleteAnnouncement/:id', auth,isDemo,deleteAnnouncement);

// ********************************************************************************************************
//                                      Gallery routes
// ********************************************************************************************************

// Routes for managing gallery
router.post('/createGalleryImage', auth, isDemo, createGalleryImage);
router.put('/updateGalleryImage/:id', auth, isDemo, updateGalleryImage);
router.get('/getAllGalleryImages', getAllGalleryImage);
router.delete('/deleteGalleryImage/:id', auth, isDemo, deleteGalleryImage);
router.get('/getGalleryImage/:id',getGallery)
// ********************************************************************************************************
//                                      Carousel routes
// ********************************************************************************************************

// Routes for managing carousel images
router.post('/createCarouselImage', auth, isDemo, createCarouselImage);
router.put('/updateCarouselImage/:id', auth, isDemo, updateCarouselImage);
router.get('/getAllCarouselImages', getAllCarouselImage);
router.delete('/deleteCarouselImage/:id', auth, isDemo, deleteCarouselImage);

module.exports = router; 