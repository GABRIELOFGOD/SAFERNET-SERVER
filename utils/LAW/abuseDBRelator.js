const Abuse = require("../../model/LAW/report.model");

const lawReportGetter = () => Abuse.find();

const caseCodeFinder = (caseCode) => Abuse.findOne({caseCode});

// ====================== NUMBERS OF REPORTS WE HAVE IN THE DATABASE ======================= //
// const all


// ==================== REPORT SAVER TO THE DATABASE ===================== //
const abuseReportSaver = report => Abuse.create(report)

module.exports = { lawReportGetter, caseCodeFinder, abuseReportSaver }