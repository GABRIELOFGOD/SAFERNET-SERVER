const Abuse = require("../../model/LAW/report.model");

const lawReportGetter = () => Abuse.find();

// ====================== NUMBERS OF REPORTS WE HAVE IN THE DATABASE ======================= //
// const all

module.exports = { lawReportGetter }