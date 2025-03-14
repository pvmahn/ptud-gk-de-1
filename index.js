const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');

const db = require('./config/database');
const router = require('./routes/index');
const createAccountTable = require('./models/accountModel');
const createBlogTable = require('./models/blogModel');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

const hbs = exphbs.create({
   extname: '.hbs',
   helpers: {
      toString: (value) => {
         return value ? value.toString() : ''
      },
      formatDate: (date) => {
         return date ? new Date(date).toLocaleString().split(',')[0] : '';
      },
      eq: function (a, b) {
         return a === b;
      },
      formatDate: (date) => {
         const now = new Date();
         const diffInMs = now - new Date(date); //lấy ngày hiện tại trừ cho ngày tạo bài viết -> ra milisecond
         const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); //chuyển từ ms sang ngày

         const timePart = new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
         const datePart = new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" })

         if (diffInDays === 0) return `Hôm nay, ${timePart}`;
         if (diffInDays === 1) return `Hôm qua, ${timePart}`;
         return `${datePart}, ${timePart}`
      },
      firstLetterInUsername: (username) => {
         return username[0];
      },
      fromObjectToString: (id) => {
         return id.toString();
      },
      times: function (n, block) {
         let accum = '';
         for (let i = 1; i <= n; i++) {
            accum += block.fn(i);
         }
         return accum;
      },
      json: function(context) {
         return JSON.stringify(context);
      },
      formatMonth: function(monthStr) {
         const [year, month] = monthStr.split('-');
         const date = new Date(year, parseInt(month) - 1);
         return date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      },
      calculatePercentage: function(count, total) {
         if (!total) return 0;
         return Math.round((count / total) * 100);
      },
      //feature for admin page
      extractId: (id) => {
         return id.toString().slice(-6, -1);
      },
      formatCreateUserDate: (date) => {
         const timePart = new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
         const datePart = new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" })

         return `${datePart}, ${timePart}`
      },
   }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//khởi tạo database
createAccountTable(db);
createBlogTable(db);

//khởi tạo server
router(app);

app.listen(5500, () => {
   console.log("The server is running!")
});