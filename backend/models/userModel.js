const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Add email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Add valid Email']
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'managers', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Add a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password'],
        validate: {
            // This only works on CREATE AND SAVE!!
            validator: function (el) {
                return el == this.password;
            },
            message: 'Passwords are not same'
        },
        select: false

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function (next) {
    //only run this function if passwords were actually modified
    if (!this.isModified('password')) return next();
    // hash password with salt 12
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
    next();
})

userSchema.pre('save',async function(next){
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() -1000;
    next();
})

//Instance Method. Will be available on all documents of schema

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000
        // console.log(changedTimeStamp,JWTTimestamp)
        return JWTTimestamp < changedTimeStamp
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken =
        crypto.createHash('sha256')
            .update(resetToken)
            .digest('hex');

    console.log({resetToken},this.passwordResetToken)
    
    this.passwordResetExpires = Date.now()+10*60*1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema)

module.exports = User;