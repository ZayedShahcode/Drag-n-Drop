const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async options => {
    // Create a transporter
    console.log("HERE")
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }
        // Activate the gmail "less secure all" option
    })

    // Define email options
    console.log("THERE")
    const mailOptions = {
        from :'Jonas Schmedtmann <ZAYED HERE>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }
    console.log("FOREVER");

    // Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail