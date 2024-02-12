const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");
const Campaign = require("../model/campaign.model");
const Event = require("../model/event.model");

const emailChecker = (email) => Admin.findOne({email});

const phoneChecker = (mobile) => Admin.findOne({mobile});

const blogChecker = (body) => Blog.findOne({body});

const allBlogs = () => Blog.find();

const checkCampaign = (title) => Campaign.findOne({title});

const checkEvent = (topic) => Event.findOne({topic})

module.exports = {emailChecker, phoneChecker, blogChecker, allBlogs, checkCampaign, checkEvent};