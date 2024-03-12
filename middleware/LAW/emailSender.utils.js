var nodemailer = require('nodemailer');
const caseCodeEmailSender = (email, name, caseCode) => {

    let mess = 
    `<h1>Hello ${name}</h1>
    <p>Your Report has been recorded and the necessary action will be taken</p>
    <p>Please note that it will take us at least a week to pick up your case and if you want us to take it up with immediate effect, kindly reach out to us through our virtual support or phone call</p>
    <br>
    <p>In other to keep track of your report case, login to our website to track your case with your email ${email} and this case code</p>
    <h3>${caseCode}</h3>
    <small>&copy; safernet</small>
    `

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
        subject: 'Case Code from Safernet',
        html: mess
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // const transporter = nodemailer.createTransport({
    //     host: "gmail",
    //     port: 587,
    //     secure: false, // Use `true` for port 465, `false` for all other ports
    //     auth: {
    //       user: "aletechglobal@gmail.com",
    //       pass: "jn7jnAPss4f63QBp6D",
    //     },
    //   });
      
    //   // async..await is not allowed in global scope, must use a wrapper
    //   async function main() {
    //     // send mail with defined transport object
    //     const info = await transporter.sendMail({
    //       from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //       to: "bar@example.com, baz@example.com", // list of receivers
    //       subject: "Hello ✔", // Subject line
    //       text: "Hello world?", // plain text body
    //       html: "<b>Hello world?</b>", // html body
    //     });
      
    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    //   }
      
    //   main().catch(console.error);


}

module.exports = { caseCodeEmailSender }