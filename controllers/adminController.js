const User = require('../models/accountModel');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const { promisify } = require('util');
const dbAll = promisify(db.all.bind(db));
const dbRun = promisify(db.run.bind(db));

const adminController = {
    getData: async (req, res) => {
        const users = await dbAll('SELECT * FROM user_accounts', [], (err, rows) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          });

        console.log(users);
        res.render('admin', { users });
    },
    resetPassword: async (req, res) => {
        //băm mật khẩu và thêm muối
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash("123456", salt); //mặc định là 123456

        //cập nhật trường mật khẩu trong database
        await db.run(
            'UPDATE user_accounts SET password = ?, reset_password = ? WHERE username = ?',
            [hashed, false, req.body.username])

        //xóa cookie
        res.clearCookie('username');

        res.status(200).json("Reset password successfully!");
    },
    blockUser: async (req, res) => {
        const user = await db.run(
            'UPDATE user_accounts SET block = ? WHERE id = ?',
            [true, req.body.userid])

        if (!user) return res.status(404).json("Error happened");
        else {
            //xóa cookie
            res.clearCookie('username');

            return res.status(200).json("Block user successfully!");
        }
    },
    unblockUser: async (req, res) => {
        const user = await db.run(
            'UPDATE user_accounts SET block = ? WHERE id = ?',
            [false, req.body.userid])
        
        if (!user) return res.status(404).json("Error happened");
        else return res.status(200).json("Block user successfully!");
    }
}

module.exports = adminController;