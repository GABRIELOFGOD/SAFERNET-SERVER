const jwt = require("jsonwebtoken");
const Admin = require("../model/administrator.model");
const Blog = require("../model/blog.model");
const Campaign = require("../model/campaign.model");
const Event = require("../model/event.model");

const adminCreator = (admin) => Admin.create(admin);

const createdToken = (id) => {return(jwt.sign({id}, process.env.SAFERNET_SECRET_KEY, {expiresIn: '3d'}))};

const blogCreator = (blog) => Blog.create(blog);

const campaignCreator = (prep) => Campaign.create(prep);

const eventCreature = (event) => Event.create(event)

module.exports = { adminCreator, createdToken, blogCreator, campaignCreator, eventCreature }