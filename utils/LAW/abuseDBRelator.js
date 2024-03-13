const Abuse = require("../../model/LAW/report.model");

const lawReportGetter = () => Abuse.find();

const caseCodeFinder = (caseCode) => Abuse.findOne({caseCode});

const caseMailFinder = email => Abuse.findOne({email})

// ====================== NUMBERS OF REPORTS WE HAVE IN THE DATABASE ======================= //
// const all


// ==================== REPORT SAVER TO THE DATABASE ===================== //
const abuseReportSaver = report => Abuse.create(report)

module.exports = { lawReportGetter, caseCodeFinder, abuseReportSaver, caseMailFinder }