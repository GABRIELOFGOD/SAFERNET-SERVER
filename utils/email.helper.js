var nodemailer = require('nodemailer');
const emailSender = (email, messgae, title) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aletechglobal@gmail.com',
            pass: process.env.GOOGLE_EMAIL_AUTH
        }
        });

        var mailOptions = {
        from: 'aletechglobal@gmail.com',
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