const mongoose = require('mongoose')

const connectDB = async (url)=>{
    await mongoose.connect(url);
    console.log("Database connected successfully");
}
module.exports = connectDB;