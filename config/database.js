const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()

const db = new sqlite3.Database('./database/mydatabase.db', (err) => {
        if (err) {
          console.error('Lỗi khi kết nối database:', err.message);
        } else {
          console.log('Đã kết nối thành công tới SQLite database');
        }
    });


module.exports = db;