const { checkFellow, checkFellowId } = require("../utils/dbChecker");

const confirmFellowGen = async (req, res, next) => {
  const { email, fellowId } = req.body;
  try {

    // =============== INPUT VALIDATION ====================== //
    if(!email || !fellowId) return res.status(400).json({error: "Please input fellow email and fellow ID", success: false});
    
    // ==================== CONFIRMING FELLOWID AND EMAIL ======================== //
    const isFellowEmail = await checkFellow(email)
    const isFellowId = await checkFellowId(fellowId)

    if(!isFellowEmail || !isFellowId) return res.status(400).json({error: "Your input doesn't match our record", success: false});

    next()
  } catch (error) {
    res.status(500).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
  }
}

module.exports = { confirmFellowGen }