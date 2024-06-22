const { fellowIdCreate, fellowCreator } = require("../utils/creator");
const { checkFellow, checkFellowId } = require("../utils/dbChecker");
const { emailSender } = require("../utils/email.helper");
const { fellowIDGenerator, fellowMessage, onboardingMail } = require("../utils/fellow.helper");
const cloudinary = require('../config/cloudinary.config');
const { emailValidator, phoneNumberValidator, checkPassword, passwordHash, salt } = require("../utils/validator");

const genrateFellowId = async (req, res) => {
  const { email } = req.body;
  try {
    
    if(!email) return res.status(400).json({error: "Email is required to generate fellow ID", success: false});

    const isEmail = emailValidator(email)

    if(!isEmail) return res.status(400).json({error: 'This is not a valid email address', success: false});

    const emailExists = await checkFellow(email);

    if(emailExists) return res.status(400).json({error: 'This fellow has an ID generated already, If you can\'t find your fellow ID, please request for get my fellow ID from our website', success: true});

    const fellowId = await fellowIDGenerator();

    const details = { email, fellowId }

    const genratedFellowIDSaved = await fellowIdCreate(details)

    const messageF = fellowMessage(fellowId)

    const sendingMail = await emailSender(email, messageF, "Online safety fellowship Fellow ID")

    return res.status(200).json({ success: true, message: 'User ID created successfully, Fellow should check their email to get their fellow ID and login to our website to complete their profile' })

  } catch (err) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
  }
}

const fellowOnboarding = async (req, res) => {
  const { fellowId, email, password, name, phone } = req.body
  try {
    
    if(!fellowId || !email || !password || !name || !phone) return res.status(400).json({ error: 'All informations are required to be filled', success: false });

    if(!req.file) return res.status(400).json({error: "Profile image is required for identification, kindly upload your profile picture", success: false})

    const isValidPhone = phoneNumberValidator(phone)
    if(!isValidPhone) return res.status(400).json({error: "This is not a valid phone number", success: false});

    // ================= CHECKING IF PASSWORD IS STRONG ENOUGH ==================== //
    const passwordIsStrong = checkPassword(password)

    if(!passwordIsStrong) return res.status(400).json({ error: "The password entered is not strong enough, make sure your password includes at least a lowecase letter, a uppercase letter, a number and a special character", success: false });

    const salted = await salt()

    const hashedPassword = await passwordHash(password, salted)

    if(req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if(err) return res.status(400).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});
  
        const details = { 
          name,
          phone,
          email,
          fellowId,
          password: hashedPassword,
          image: result.secure_url
        }
  
        const createFellow = await fellowCreator(details);

        const messageF = onboardingMail(name)

        const sendingMail = await emailSender(email, messageF, `Welcome on board ${name}`)
  
        return res.status(200).json({message: `Welcome on board ${name} your account has been created successfully`, success: true})
      })
    }
    
  } catch (err) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    console.log(err)
  }
}

const confirmFellow = async (req, res) => {
  try {
    
    res.status(200).json({ message: "This user is verified", success: true })
  } catch (err) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
  }
}

module.exports = { genrateFellowId, fellowOnboarding, confirmFellow }