const auth = require('./authRoute');
const blog = require('./blogRoute');
const admin = require('./adminRoute');

const router = (app) => {
    app.use('/auth', auth);
    app.use('/', blog);
    app.use('/admin', admin);
}
module.exports = router;