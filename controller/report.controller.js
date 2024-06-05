const cloudinary = require("../config/cloudinary.config");
const { reportCreator } = require("../utils/creator");
const { allReports } = require("../utils/dbChecker");
const { urlValidator } = require("../utils/validator");

const makeReport = async (req, res) => {
    const { report, title, information, url } = req.body;
    try {
        
        // console.log(req.body)
        // ======================= VALIDATING INPUT INFORMATION ======================== //
        if(!information) return res.status(401).json({error: 'Your report must include an information', success: false})

        // ======================= VALIDATING URL ============================ //
        if(url){
            const isUrl = urlValidator(url);
            if(!isUrl) return res.status(401).json({error: 'This is not a valid url', success: false})
        }
        if(req.file){
            const imageResult = await cloudinary.uploader.upload_large(req.file.path, async (err, result) => {
                if(err) return res.status(401).json({error: "There was an error uploading your file", success: false, errLog: err})

                let newReport = {
                    report,
                    title,
                    information,
                    url,
                    file: result.secure_url
                }

                const postReport = await reportCreator(newReport);
                res.status(201).json({message: 'Report posted with file', success: true, text: postReport})
            })
        }else{
            
            const newReport = {
                report,
                title,
                information,
                url
            }

            const postReport = await reportCreator(newReport);
            res.status(201).json({message: 'Report posted', success: true, text: postReport});
        }
        
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

const getReports = async (req, res) => {
    try {

        const theReports = await allReports();
        res.status(201).json({theReports})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
        console.log(err)
    }
}

module.exports = {makeReport, getReports};