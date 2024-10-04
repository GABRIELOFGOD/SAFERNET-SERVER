var nodemailer = require('nodemailer');
const emailSender = (email, messgae, title) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'report@thesafernet.org',
            pass: process.env.GOOGLE_EMAIL_AUTH
        }
        });

        var mailOptions = {
        from: 'Report from Safernet',
        to: email,
        subject: title,
        html: messgae
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = { emailSender }