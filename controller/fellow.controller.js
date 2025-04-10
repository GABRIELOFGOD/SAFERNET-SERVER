const { fellowIdCreate, fellowCreator, getAllFellows, findFellow, createdToken } = require("../utils/creator");
const { checkFellow, checkFellowId, getSingleFellow, getFellowById } = require("../utils/dbChecker");
const { emailSender } = require("../utils/email.helper");
const { fellowIDGenerator, fellowMessage, onboardingMail } = require("../utils/fellow.helper");
const cloudinary = require('../config/cloudinary.config');
const { emailValidator, phoneNumberValidator, checkPassword, passwordHash, salt, passwordCompare } = require("../utils/validator");

const genrateFellowId = async (req, res) => {
  const { email } = req.body;
  try {
    
    if(!email) return res.status(400).json({error: "Email is required to generate fellow ID", success: false});

    const isEmail = emailValidator(email)

    if(!isEmail) return res.status(400).json({error: 'This is not a valid email address', success: false});

    const emailExists = await checkFellow(email);

    if(emailExists) return res.status(400).json({error: 'This fellow has an ID generated already, If you can\'t find your fellow ID, please request for get my fellow ID from our website', success: false});

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

    const fellowOnboarded = await findFellow(fellowId);

    if (fellowOnboarded) return res.status(400).json({error: "You are done with onboarding already, kindly login to your account", success: false});

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
    const fellow = req.fellow;
    const fellowOnboarded = await findFellow(fellow.fellowId);

    if (fellowOnboarded) return res.status(400).json({error: "You are done with onboarding already, kindly login to your account", success: false});
    res.status(200).json({ message: "Data fetched", success: true, fellow });
  } catch (err) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
  }
}

const getFellows = async (req, res) => {
  try {
    const fellows = await getAllFellows();
    res.status(200).json({ fellows: fellows.fellow, success: true });
  } catch (error) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: error})
  }
}

const fellowLogin = async (req, res) => {
  try {
    const { fellowId, password } = req.body;
    const fellow = await getSingleFellow(fellowId);
    
    if (!fellow) return res.status(400).json({ error: "Invalid credentials", success: false });

    // ======================== COMPARING PASSWORD ====================== //
    const validPassword = await passwordCompare(password, fellow.password);
    if(!validPassword) return res.status(401).json({error: 'Invalid credentials', success: false});

    const token = createdToken(fellow._id);
    res.json({ fellow, token });
  } catch (error) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: error})
  }
}

const fellowProfile = async (req, res) => {
  try {
    const { id } = req.fellow;
    if (!id) return res.status(401).json({ error: "Unauthorized", success: false });
    
    const fellow = await getFellowById(id);
    if (!fellow) return res.status(401).json({ error: "Unauthorized", success: false });

    const token = createdToken(fellow._id);

    res.status(200).json({ fellow, success: true, token });
  } catch (error) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: error});    
  }
}

module.exports = { genrateFellowId, fellowOnboarding, confirmFellow, getFellows, fellowLogin, fellowProfile }