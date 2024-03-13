const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoDbConnect = require('./config/mongodb.config');
const blogRouter = require('./routes/blog.router');
const adminRouter = require('./routes/administrator.router');
const campaignRouter = require('./routes/campaign.router');
const eventRouter = require('./routes/event.router');
const reportRouter = require('./routes/report.router');
const newsletterRouter = require('./routes/newsletter.router');

// =================== LAW AND ABUSE ROUTES ====================== //
const lawReportRouter = require('./routes/LAW/report.router')

const app = express();
app.use(helmet())
const PORT = process.env.PORT || 3200
mongoDbConnect();

app.use(cors({
    origin: ['http://localhost:5173', 'https://safernet-gamma.vercel.app', 'https://llegal.vercel.app'],
    // origin: 'https://safernet-gamma.vercel.app',
    credentials: true
}))
app.use(
    rateLimit({
      max: 300,
      windowMs: 60 * 60 * 1000,
      message: "Please try again later!",
    })
);

app.use(express.json());
app.use(cookieParser())

// ==================== END POINTS ======================== //
app.use('/blog', blogRouter);
app.use('/admin', adminRouter);
app.use('/campaign', campaignRouter);
app.use('/event', eventRouter);
app.use('/report', reportRouter);
app.use('/newsletter', newsletterRouter);

// ================== REPORT END-POINTS ================== //
app.use('/abuse', lawReportRouter);

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
})