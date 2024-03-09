const { newsletterCreator } = require("../utils/creator");
const { checkNewsletter } = require("../utils/dbChecker");

const subscriber = async (req, res) => {
    const { email } = req.body;
    try {
        
        if(!email) return res.status(401).json({error: 'Please Input Your email to subscribe to our newsletter', success: false})

        const isEmail = emailValidator(email)
        if(!isEmail) return res.status(401).json({error: 'This is not a valid Email', success: false})

        const isExists = await checkNewsletter(email);
        if(isExists) return res.status(201).json({message: 'Thank you for subscribing to our email', success: true})

        const subscribed = await newsletterCreator(email)
        res.status(201).json({message: 'Thank you for subscribing to our email', success: true})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

module.exports = subscriber;