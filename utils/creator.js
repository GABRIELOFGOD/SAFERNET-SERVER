const jwt = require("jsonwebtoken");
const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");
const Campaign = require("../model/campaign.model");
const Event = require("../model/event.model");
const Report = require("../model/report.model");
const Newsletter = require("../model/newsletter.model");
const Abuse = require("../model/LAW/report.model");
const { GenFellow, Fellow } = require("../model/fellow.model");
const Media = require("../model/media.model");

const adminCreator = (admin) => Admin.create(admin);

const createdToken = (id) => {return(jwt.sign({id}, process.env.SAFERNET_SECRET_KEY, {expiresIn: '3d'}))};

const blogCreator = (blog) => Blog.create(blog);

const campaignCreator = (prep) => Campaign.create(prep);
const createCampaign = async (prep) => (await Campaign.create(prep)).populate("postedBy");

const eventCreature = (event) => Event.create(event);

const reportCreator = report => Report.create(report);

const newsletterCreator = email => Newsletter.create(email);

const mediaPhotoPoster = payload => Media.create(payload);


// ================ FOR FELLOWS ======================== //
const fellowIdCreate = details => GenFellow.create(details);

const fellowCreator = details => Fellow.create(details);

const findFellow = async fellowId => await Fellow.findOne({ fellowId });

const getAllFellows = async () => Fellow.find().populate('campaigns').select('-password').sort({createdAt: -1}).then((fellow) => {
    if(!fellow) return {error: 'No fellow found', success: false};
    return {fellow, success: true}
}).catch((err) => {
    return {error: 'Something went wrong', success: false, errLog: err};
});


module.exports = { adminCreator, createdToken, blogCreator, campaignCreator, eventCreature, reportCreator, newsletterCreator, fellowIdCreate, fellowCreator, mediaPhotoPoster, getAllFellows, findFellow, createCampaign };