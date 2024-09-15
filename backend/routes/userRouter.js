const authController = require('../controllers/authController')
const userController = require('../controllers/userController');
const express= require('express')

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp)
userRouter.route('/login').post(authController.login);
userRouter.route('/forgotPassword').patch(authController.forgotPassword)
userRouter.route('/resetPassword/:token').patch(authController.resetPassword)
userRouter.route('/updatePassword').patch(authController.protect,authController.updatePassword)

userRouter.route('/getAllUsers')
.get(userController.getAllUsers)

module.exports = userRouter