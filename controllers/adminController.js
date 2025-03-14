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
    getDashboard: async (req, res) => {
        try {
            // Lấy tổng số bài viết
            const totalPosts = await dbAll('SELECT COUNT(*) as count FROM blogs', []);
            
            // Lấy tổng số người dùng
            const totalUsers = await dbAll('SELECT COUNT(*) as count FROM user_accounts', []);
            
            // Lấy 5 bài viết mới nhất
            const recentPosts = await dbAll(`
                SELECT 
                    blogs.id,
                    blogs.author,
                    blogs.content,
                    blogs.image,
                    blogs.created_at,
                    blogs.updated_at,
                    user_accounts.username,
                    user_accounts.email
                FROM blogs 
                JOIN user_accounts ON blogs.author = user_accounts.username
                ORDER BY blogs.created_at DESC 
                LIMIT 5
            `, []);
            console.log(recentPosts);
            
            // Lấy thống kê bài viết theo tháng
            const monthlyStats = await dbAll(`
                SELECT 
                    strftime('%Y-%m', created_at) as month,
                    COUNT(*) as post_count
                FROM blogs
                GROUP BY strftime('%Y-%m', created_at)
                ORDER BY month DESC
                LIMIT 6
            `, []);

            console.log(monthlyStats);

            res.render('dashboard', {
                totalPosts: totalPosts[0].count,
                totalUsers: totalUsers[0].count,
                recentPosts,
                monthlyStats
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
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