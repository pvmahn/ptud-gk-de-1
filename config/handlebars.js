const hbs = require('hbs');

// Đăng ký helper json để chuyển đổi dữ liệu thành chuỗi JSON
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

module.exports = hbs; 