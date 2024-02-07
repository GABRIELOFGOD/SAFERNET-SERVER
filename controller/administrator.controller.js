const { adminCreator, createdToken } = require("../utils/creator");
const { emailChecker, phoneChecker } = require("../utils/dbChecker");
const { emailValidator, passwordHash, salt, passwordCompare } = require("../utils/validator");

const createAdmin = async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {

        // ============== VALIDATING INPUTS ==================== //
        if(!name || !email || !password) return res.status(402).json({error: 'Name, email and password fields are required', success: false})

        // ============== VALIDATING ATHENTICITY OF EMAIL ======================= //
        const validEmail = emailValidator(email);
        if(!validEmail) return res.status(401).json({error: 'This is not a valid Email', success: false});

        // ========================== CHECKING IF USER EXIST ============================= //
        const emailExists = await emailChecker(email);
        const phoneExists = await phoneChecker(mobile);
        if(emailExists || phoneExists) return res.status(402).json({error: 'This user alresdy exists', success: false});

        // ====================== HASHING PASSWORD ============================ //
        const salted = await salt();
        const hashedPassword = await passwordHash(password, salted);
        const user = {
            name,
            email,
            mobile,
            password: hashedPassword
        };

        // ========================== SAVING NEW ADMIN TO THE DATABASE =============================== //
        const newAdmin = await adminCreator(user);
        res.status(201).json({success: true, message: 'New Admin created Successfully'})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

const loginAdmin = async (req, res) => {
    const {email, phone, password} = req.body;
    try {

        // ===================== CHECKING FOR DOUBLE ENTRY ================== //
        if(email && phone) return res.status(401).json({error: 'Can not input email and mobile at the same time', success: false})
        
        // ===================== VALIDATING INPUTS ========================= //
        if(!email && !phone || !password) return res.status(401).json({error: 'Login with your email or phone number and your password inclusive', success: false})

        // ===================== CHECKING IF USER EXISTS ============================ //
        const seenEmail = await emailChecker(email);
        const seenPhone = await phoneChecker(phone);

        const theUser = seenEmail || seenPhone

        if(!theUser) return res.status(401).json({error: 'Invalid credentials! Check your inputs and try again', success: false})

        // ======================== COMPARING PASSWORD ====================== //
        const validPassword = await passwordCompare(password, theUser.password);
        if(!validPassword) return res.status(401).json({error: 'Invalid credentials! Check your inputs and try again', success: false})

        // ======================= CREATING COOKIE TOKEN ======================== //
        const token = createdToken(theUser._id)
        res.cookie('SaferAdmin', token, { httpOnly: true, maxAge: 1000*60*60*24*3 })
        res.json({message: 'Admin Logged in successfully'})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}

module.exports = {createAdmin, loginAdmin};