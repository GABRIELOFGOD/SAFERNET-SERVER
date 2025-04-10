var nodemailer = require('nodemailer');
const emailSender = (email, message, title) => {

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: 'thesafernet.org',
        port: 465,
        secure: true,
        auth: {
            user: 'report@thesafernet.org',
            pass: process.env.GOOGLE_EMAIL_AUTH
        }
    });

    var mailOptions = {
        from: 'Safernet <report@thesafernet.org>',
        to: email,
        subject: title,
        html: message
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = { emailSender }