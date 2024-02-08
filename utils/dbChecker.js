const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");

const emailChecker = (email) => Admin.findOne({email});

const phoneChecker = (mobile) => Admin.findOne({mobile});

const blogChecker = (body) => Blog.findOne({body});

const allBlogs = () => Blog.find();

const checkCampaign = () => ''

module.exports = {emailChecker, phoneChecker, blogChecker, allBlogs, checkCampaign};