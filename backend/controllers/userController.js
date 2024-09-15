const User = require('./../models/userModel')
 
const getAllUsers = async (req,res,next)=>{
    const users = await User.find({});
    res.status(200).json({
        "status":"Success",
        data:users
    })
}

module.exports = {getAllUsers}