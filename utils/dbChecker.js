const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");
const Campaign = require("../model/campaign.model");
const Event = require("../model/event.model");
const Report = require("../model/report.model");

const emailChecker = (email) => Admin.findOne({email});

const phoneChecker = (mobile) => Admin.findOne({mobile});

const adminFinder = id => Admin.findById(id)

const blogChecker = (body) => Blog.findOne({body});

const allBlogs = () => Blog.find();

const checkCampaign = (title) => Campaign.findOne({title});

const checkEvent = (title) => Event.findOne({title});

const getEvent = () => Event.find();

const allReports = () => Report.find();

const campaginGetter = () => Campaign.find();

module.exports = {emailChecker, phoneChecker, adminFinder, blogChecker, allBlogs, checkCampaign, checkEvent, getEvent, allReports, campaginGetter};