const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoDbConnect = require('./config/mongodb.config');
const blogRouter = require('./routes/blog.router');
const adminRouter = require('./routes/administrator.router');
const campaignRouter = require('./routes/campaign.router');
const eventRouter = require('./routes/event.router');
const reportRouter = require('./routes/report.router');
const newsletterRouter = require('./routes/newsletter.router');
const fellowRouter = require('./routes/fellow.router');
const mediaRouter = require('./routes/media.router');
const commentRouter = require('./routes/comment.router');

// =================== LAW AND ABUSE ROUTES ====================== //
const lawReportRouter = require('./routes/LAW/report.router');
const { generateSignature } = require('./config/sign');

const app = express();
const PORT = process.env.PORT || 3200
mongoDbConnect();

app.use(cors({
    origin: ['https://thesafernet.org', 'http://localhost:5173', 'http://localhost:5174', 'https://safernet-gamma.vercel.app'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.post("/generate-signature", generateSignature)

// ==================== END POINTS ======================== //
app.use('/blog', blogRouter);
app.use('/admin', adminRouter);
app.use('/campaign', campaignRouter);
app.use('/event', eventRouter);
app.use('/report', reportRouter);
app.use('/newsletter', newsletterRouter);
app.use('/fellow', fellowRouter);
app.use('/media', mediaRouter);
app.use('/comment', commentRouter);

// ================== REPORT END-POINTS ================== //
app.use('/abuse', lawReportRouter);

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
})