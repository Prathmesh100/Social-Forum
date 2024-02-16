const mongoose = require('mongoose')

require("dotenv").config();

const dbConnect= () =>
{
    mongoose.connect(process.env.DATABASE_URL,
        {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        })
        .then(()=>console.log('Connected to database'))
        .catch((error)=>
        {
            console.error(error.message);
            console.log('Error connecting to database');
            process.exit(1);
        })
}

module.exports =dbConnect;