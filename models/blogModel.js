const mongoose = require('mongoose');

const createBlogTable = (db) => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,       
                author VARCHAR(255) NOT NULL,              
                content TEXT NOT NULL,         
                image TEXT,            
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            );`
            , (err) => {
          if (err) {
            console.error('Lỗi khi tạo bảng:', err.message);
          } else {
            console.log('Bảng users đã được tạo hoặc đã tồn tại');
          }
        });
      });
}

module.exports = createBlogTable;