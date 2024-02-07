const exprees = require('express');
require('dotenv').config();
const blogRouter = require('./routes/blog.router');
const adminRouter = require('./routes/administrator.router')
const mongoDbConnect = require('./config/mongodb.config');

const app = exprees();
const PORT = process.env.PORT || 3200
mongoDbConnect();

app.use(exprees.json());

// ==================== END POINTS ======================== //
app.use('/blog', blogRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`)
})