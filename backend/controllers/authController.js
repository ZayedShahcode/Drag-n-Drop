const {promisify}  = require('util');
const User = require('./../models/userModel')
const jwt = require('jsonwebtoken')
const session = require('express-session')
require('dotenv').config()
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email')
const crpyto = require('crypto');



// jwt.sign(payload,secretOrPrivatekey,{options,callback})

const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user,statusCode,res)=>{
    const token  = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        
        httpOnly: true
    }

    if(process.env.NODE_ENV=== 'production') cookieOptions.secure = true;

    res.cookie('jwt',token,cookieOptions)
    
    user.password =undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

const signUp = async (req, res, next) => {
    const {email,password,confirmPassword} = req.body;
    try {
        console.log(req.body)
        const user =  await User.findOne({email})
        if(user){
            console.log(user)
            return next(new AppError('User already exist. Please login', 400));
        }
        console.log("Here2")
        const newUser = await User.create({email,password,confirmPassword});

        createSendToken(newUser,200,res);
    }
    catch (err) {
        res.status(404).send(err)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // check  email and password actually exists
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        // check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');
        const correct = await user.correctPassword(password,user.password)
        if(!user || !correct){
            // console.log({email,password})
            return next(new AppError('Incorrect email or password',401));
        }
        // console.log({email,password})

        // if everything ok the send token to client 
       createSendToken(user,200,res);
       
    } catch (err) {
        res.send(err)
    }
}

// Protect

const protect = async (req,res,next)=>{
    try{
        // 1) Get token and check if its there or not
        let token = req.cookies.jwt
       
      
        
        // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //     token = req.headers.authorization.split(' ')[1];
        // }
        
        // console.log(token)
        if(!token){
            return next(new AppError("Please Login first",401))
        }
        
        // 2) Verification token
        const decoded=  await promisify(jwt.verify)(token,process.env.JWT_SECRET) // promisify is a built in js function to make a normal function into promise
        // console.log(decoded)
        // 3) Check if user still exists
        const currentUser  = await User.findById(decoded.id);
        if(!currentUser){
            return next(new AppError("User does not exist",401))
        }

        // 4) Check if user Changed passwords after token was issued.
        if(currentUser.changesPasswordAfter(decoded.iat)){
            return next(new AppError("Password Changed recently please login again",401))
        }
        req.user = currentUser;
        // console.log(req.user)

        next();
    }
    catch(err){
        res.send(err);
    }
    

}

const restrictTo = (...roles)=>{
    return (req,res,next)=>{

        // roles = ['admin','moderator'] role ='user'
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have permission to perform this action",403));
        }
        next()
    }
}

const forgotPassword = async (req,res,next) =>{
    // 1? get user based on posted email
            const user = await User.findOne({email: req.body.email})
            if(!user){
                return next(new AppError('User with this email does not exist',404))
            }
        // 2) Generate random reset token
            const resetToken = user.createPasswordResetToken();
            await user.save({validateBeforeSave : false});
            
        // 3) Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`

        const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to : ${resetURL}.\n
                        If you remember your password ignore`
        console.log(message);
        try{
            await sendEmail({
                emai: user.email,
                subject: 'Your password reset token valid for 10mins',
                message: message
            });
            res.status(200).json({
                status:'success',
                message:"Token sent to email"
            })
            next()
        }
        catch(err){
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave : false});
            res.send(err);
            // return next(new AppError('There was an error sending reset email, try later',500));
        }
        
}

const resetPassword = async (req,res,next) =>{
    // get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}

    })

    // If token has not expired and there is user then set new password
    if (!user){
        return next(new AppError("Token is invalid or has expired",400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPoassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // update changedPasswordAt prop for user

    //  log user in and send JWT
    const token = signToken(user._id);
    res.status(200).json({
        message:"Success",
        token
    })
}

const updatePassword = async (req,res,next) =>{
    // get user from collectiona
    const user =  await User.findById(req.user.id).select('+password');
    // check if posted current password is correct
    if(!( await user.correctPassword(req.body.confirmPassword,user.password))){
        return next(new AppError('Your current password is wrong',401))
    }
    // if so update password
    user.password = req.body.confirmPassword;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // log user in send jwt
    const token = signToken(user._id);
    res.status(200).json({
        message:"Success",
        token
    })
}

module.exports = { signUp, login, protect,restrictTo,forgotPassword,resetPassword,updatePassword};