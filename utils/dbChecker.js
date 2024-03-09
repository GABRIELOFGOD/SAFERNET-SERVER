const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");
const Campaign = require("../model/campaign.model");
const Event = require("../model/event.model");
const Newsletter = require("../model/newsletter.model");
const Report = require("../model/report.model");

const emailChecker = (email) => Admin.findOne({email});

const phoneChecker = (mobile) => Admin.findOne({mobile});

const adminFinder = id => Admin.findById(id)

// ======================== BLOG DB CHECKERS ============================= //
const blogChecker = (body) => Blog.findOne({body});
const allBlogs = () => Blog.find();
const singleBlog = id => Blog.findById(id);
const blogDeleter = id => Blog.findByIdAndDelete(id);
const blogUpdater = (id, body) => Blog.findByIdAndUpdate(id, body);

const checkEvent = (title) => Event.findOne({title});

const getEvent = () => Event.find();

const allReports = () => Report.find();

// ========================= CAMPAIGN DB CHECKER ===================================== //
const checkCampaign = (title) => Campaign.findOne({title});
const campaginGetter = () => Campaign.find();
const oneCampaign = id => Campaign.findById(id);

// ======================= NEWSLETTER DB CHECKER ================================== //
const checkNewsletter = email => Newsletter.find({email});

module.exports = {emailChecker, phoneChecker, adminFinder, blogChecker, allBlogs, checkCampaign, checkEvent, getEvent, allReports, campaginGetter, singleBlog, blogDeleter, blogUpdater, oneCampaign, checkNewsletter};