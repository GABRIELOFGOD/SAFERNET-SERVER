const { caseCodeEmailSender } = require("../../middleware/LAW/emailSender.utils");
const { caseCodeFinder, abuseReportSaver } = require("../../utils/LAW/abuseDBRelator");
const { gettingReportLength, caseCodeCreator, reverseString } = require("../../utils/LAW/abuseReport.utils");
const { emailValidator } = require("../../utils/validator");


const lawReportPoster = async (req, res) => {
    const { name, age, gender, abuse, evidence, evidenceType, actionTaken, actionWant, email, phone, reportMeans, who } = req.body;
    try {

        if(!req.file){
            console.log('got here')
            let caseCode ;
            let receivedCode
    
            // ============================ TODO ============================= //
            // VALIDATE ALL USER INPUT TO DETECT PROXY
            // SEND CASECODE TO USER EMAIL 
    
            if( !name || !age || !gender || !abuse || !actionTaken || !actionWant || !email || !phone || !reportMeans || !who ) return res.status(402).json({error: 'All questions must be answered', success: false, body:{ name, age, gender, abuse, evidence, evidenceType, actionTaken, actionWant, email, phone, reportMeans, who }})
    
            // ===================== VALIDATING EMAIL ========================= //
            const isEmail = emailValidator(email);
            if(!email) return res.status(402).json({error: 'This is mot a valid email address', success: false});
    
            const client = await gettingReportLength()
    
            // ================== CREATING CASE ID ======================= //
            const caseId = `BBYDI/${Date.now()}/ABR/${client}/ACT` // ================== ABR STANDS FOR ABUSE REPORT LENGTH ================ //  // ================== ACT STANDS ACTION ================ //
            
            // ==================== CREATING CASE CODE ==================== //
            // ============== REVERSING ABUSE TYPE BEFORE USING IT =============== //
            const reverser = reverseString(abuse)
            receivedCode = caseCodeCreator(reverser)
    
            const isExistCode = await caseCodeFinder(receivedCode)
    
            // ============== CHECKING IF CASECODE EXISTS IN DATABASE ============== //
            if(isExistCode){
                receivedCode = caseCodeCreator(reverser)
            } else {
                caseCode = receivedCode
            }
    
            const storeReport = {
                name,
                email,
                phone,
                age,
                gender,
                abuse,
                evidence,
                evidenceType,
                actionTaken,
                actionWant,
                caseId,
                caseCode,
                caseStatus: 'pending',
                reportMeans,
                who
            }
    
            const saver = await abuseReportSaver(storeReport)
    
            const sendEmail = await caseCodeEmailSender(email, name, caseCode)
    
            return res.status(201).json({success: true, message: 'Your Report has been received and will be looked into, kindly check your email for your case tracking code', caseCode: caseCode })
            
        } else {
            return res.status(201).json({success: true, message: 'Your Report has been received with file and will be looked into, kindly check your email for your case tracking code', caseCode: caseCode })
        }
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err});
    }
}


module.exports = { lawReportPoster }