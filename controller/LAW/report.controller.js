const { gettingReportLength, caseCodeCreator, reverseString } = require("../../utils/LAW/abuseReport.utils");
const { emailValidator } = require("../../utils/validator");


const lawReportPoster = async (req, res) => {
    const { name, age, gender, abuse, evidence, evidenceType, actionTaken, actionWants, email, phone } = req.body;
    try {

        if(!name || !age || !gender || !abuse || !evidence || !actionTaken || !actionWants || !email || !phone ) return res.status(402).json({error: 'All questions must be answered', success: false})

        // ===================== VALIDATING EMAIL ========================= //
        const isEmail = emailValidator(email);
        if(!email) return res.status(402).json({error: 'This is mot a valid email address', success: false});

        const client = await gettingReportLength()

        // ================== CREATING CASE ID ======================= //
        const caseId = `BBYDI/${Date.now()}/ABR/${client}/ACT` // ================== ABR STANDS FOR ABUSE REPORT LENGTH ================ //  // ================== ACT STANDS ACTION ================ //
        
        // ==================== CREATING CASE CODE ==================== //
        // ============== REVERSING ABUSE TYPE BEFORE USING IT =============== //
        const reverser = await reverseString(abuse)
        const caseCode = await caseCodeCreator(reverser)

        console.log('case id', caseId)
        console.log('case code', caseCode)
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}


module.exports = { lawReportPoster }