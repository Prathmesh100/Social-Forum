//app create
const express= require('express');
const app = express();
const cookieParser= require("cookie-parser");

//PORT defined
require("dotenv").config();
const PORT= process.env.PORT || 4000;

//Middleware
const bodyParser=require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//For temporary storing of file till its is uploading in cloudinary
const FileUpload=require("express-fileupload");
app.use(FileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
})); 

//db connect
const dbConnect= require('./config/database');
dbConnect();

//cloudConnect
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//api route mount
const routes= require("./router/routes");

// Enable CORS

const cors = require("cors");
app.use(
    cors({
        origin: '*',
        credentials:true,
        optionSuccessStatus:200,

    })
)



app.use("/",routes);


  

app.get("/",(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-MEthods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');       ;
    res.send({ "msg": `App is listening on ${PORT}` })
    })


//activation server
app.listen(PORT,()=>
{
    console.log(`App is listening on ${PORT}`)
});  