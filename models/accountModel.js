const db = require('../config/database');

const createAccountTable = (db) => {
    db.serialize(() => {
        // Tạo bảng nếu chưa tồn tại
        db.run(
            `CREATE TABLE IF NOT EXISTS user_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                username VARCHAR(255) NOT NULL,       
                email VARCHAR(255) NOT NULL,          
                password VARCHAR(255) NOT NULL UNIQUE,
                role VARCHAR(20) DEFAULT 'viewer',
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
                    
                    // Thêm cột role nếu chưa tồn tại
                    db.all(`PRAGMA table_info(user_accounts)`, [], (err, rows) => {
                        if (err) {
                            console.error('Lỗi khi kiểm tra cấu trúc bảng:', err.message);
                            return;
                        }
                        
                        // Kiểm tra xem cột role đã tồn tại chưa
                        const hasRoleColumn = rows && rows.some(row => row.name === 'role');
                        
                        if (!hasRoleColumn) {
                            // Thêm cột role nếu chưa tồn tại
                            db.run(`ALTER TABLE user_accounts ADD COLUMN role VARCHAR(20) DEFAULT 'viewer'`, (err) => {
                                if (err) {
                                    console.error('Lỗi khi thêm cột role:', err.message);
                                } else {
                                    console.log('Đã thêm cột role vào bảng user_accounts');
                                    
                                    // Cập nhật role mặc định cho các user hiện có
                                    db.run(`UPDATE user_accounts SET role = 'viewer' WHERE role IS NULL`, (err) => {
                                        if (err) {
                                            console.error('Lỗi khi cập nhật role mặc định:', err.message);
                                        } else {
                                            console.log('Đã cập nhật role mặc định cho các user hiện có');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
    });
}

module.exports = createAccountTable;