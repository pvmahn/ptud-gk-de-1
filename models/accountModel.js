const db = require('../config/database');

const createAccountTable =(db) => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS user_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                username VARCHAR(255) NOT NULL,       
                email VARCHAR(255) NOT NULL,          
                password VARCHAR(255) NOT NULL UNIQUE,
                block BOOLEAN DEFAULT FALSE,          
                reset_password BOOLEAN DEFAULT FALSE, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            );`
            , (err) => {
          if (err) {
            console.error('Lỗi khi tạo bảng:', err.message);
          } else {
            console.log('Bảng accounts đã được tạo hoặc đã tồn tại');
          }
        });
    });
}

module.exports = createAccountTable;