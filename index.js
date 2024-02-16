const express = require('express');
const app = express();

require('dotenv').config();

const database= require("./config/database");
const {cloudnairyconnect}=require("./config/cloudinary");
const fileUpload= require("express-fileupload");

const PORT= process.env.PORT || 4000;

database.connect();

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)

//cloudinary connection
cloudnairyconnect();

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running....."
    });
})

app.listen(PORT,()=>{
    console.log(`app running at ${PORT}`)
})