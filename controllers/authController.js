const db = require('../config/database');
const bcrypt = require('bcrypt');

const { promisify } = require('util');
const dbGet = promisify(db.get.bind(db));

const authController = {
    register: (req, res) => {
        res.render('register');
    },
    submitRegister: async (req, res) => {
        try {
            console.log(req.body);
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            await db.run(
                'INSERT INTO user_accounts (username, email, password) VALUES (?, ?, ?)',
                [req.body.username, req.body.email, hashed],
                function (err) {
                  if (err) {
                    console.error('Lỗi khi tạo tài khoản:', err.message);
                    return res.status(500).json({ error: err.message });
                  }
                  return res.status(201).json({ notice: 'Tài khoản đã được tạo'});
                }
            );
        } catch (err) {
            res.status(500).json(err);
        }


    },
    login: (req, res) => {
        res.render('login');
    },
    submitLogin: async (req, res) => {
        console.log(req.body);
        const user = await dbGet(
            'SELECT * FROM user_accounts WHERE username = ?',
            [req.body.username], (err, row) => {
                if (err) {
                    console.error('Lỗi khi truy vấn user:', err.message);
                } else if (row) {
                    console.log('User tìm thấy:', row);
                    user = row;
                } else {
                    console.log('Không tìm thấy user với username:', req.body.username);
                }
            }
        )
        console.log(user);

        if (!user) return res.status(404).json('Not found username!');

        //kiểm tra admin đã reset password cho tài khoản này chưa
        if (user.resetPassword) return res.status(404).json("reset");

        //kiểm tra admin đã khóa tài khoản này chưa
        if (user.block === true) return res.status(404).json("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để mở lại.")

        const validation = await bcrypt.compare(
            req.body.password, user.password
        );

        if (!validation) return res.status(404).json("Wrong password!");
        /**
         * A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol. 
         * It's never sent with unsecured HTTP (except on localhost)
         * Do đó, khi deploy lên cloud thì nên bỏ thuộc tính secure, hoặc nếu vẫn dùng thì sử dụng HTTPS qua nginx ...
         */
        if (user && validation) {
            res.cookie('username', req.body.username, {
                maxAge: 60 * 1000 * 1000,
                httpOnly: true,
                secure: true,
                path: '/',
            })
            return res.status(200).json("Login successfully!")
        }
    },
    logout: async (req, res) => {
        res.clearCookie('username');
        res.redirect('/auth/login');
    },
    resetPassword: (req, res) => {
        res.render('resetPassword');
    },
    resetPasswordAction: async (req, res) => {
        console.log(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const user = await db.run(
            'UPDATE user_accounts SET password = ?, reset_password = ? WHERE username = ?',
            [hashed, false, req.body.username])
        

        return res.status(200).json("Thay đổi mật khẩu thành công! Quay lại trang đăng nhập");
    }
}

module.exports = authController;