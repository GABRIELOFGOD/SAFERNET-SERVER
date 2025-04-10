const { checkFellow, checkFellowId } = require("../utils/dbChecker");
const jwt = require("jsonwebtoken");

const confirmFellowGen = async (req, res, next) => {
  const { email, fellowId } = req.body;
  try {

    // =============== INPUT VALIDATION ====================== //
    if(!email || !fellowId) return res.status(400).json({error: "Please input fellow email and fellow ID", success: false});
    
    // ==================== CONFIRMING FELLOWID AND EMAIL ======================== //
    const isFellowEmail = await checkFellow(email)
    const isFellowId = await checkFellowId(fellowId)

    if(!isFellowEmail || !isFellowId) return res.status(400).json({error: "Your input doesn't match our record", success: false});

    if (isFellowId.fellowId !== isFellowEmail.fellowId) return res.status(400).json({error: "Your input doesn't match our record", success: false});

    req.fellow = isFellowEmail;

    next()
  } catch (error) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
  }
}

const fellowAuth = async (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Unauthorized", success: false });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized", success: false });
  
  const decodedToken = jwt.verify(token, process.env.SAFERNET_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized", success: false });
    return decoded;
  });

  if (!decodedToken) return res.status(401).json({ error: "Unauthorized", success: false });
  req.fellow = decodedToken;
  next();
}

module.exports = { confirmFellowGen, fellowAuth };