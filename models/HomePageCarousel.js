const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
    {
        image:{
            type: String,
            required: true,
        }
    },
    {timestamps: true}
)

module.exports= mongoose.model("carousel", carouselSchema);