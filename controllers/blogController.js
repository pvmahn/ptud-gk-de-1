const db = require('../config/database');
const { promisify } = require('util');
const dbAll = promisify(db.all.bind(db));
const multer = require('multer');

var page = undefined;

const blogController = {
    //idea: lưu username vào cookie, khi cần thì lấy ra
    showBlog: async (req, res) => {
        if (!req.cookies.username) {
            res.redirect('/auth/login');
        }

        const blogs = await dbAll('SELECT * FROM blogs', [], (err, rows) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          });

        const usernameCookie = req.cookies.username;
        //.lean() dùng để giúp cho handlebars có thể hiển thị dữ liệu 

        // tính toán số lượng trang để phân
        const itemsPerPages = 10;
        const numberOfPages = Math.ceil(blogs.length / itemsPerPages);

        //kiểm tra trang
        console.log(page, numberOfPages);
        if (!page) {
            return res.render('blog', { blogs, usernameCookie, numberOfPages });
        }
        else {
            const start = (page - 1) * itemsPerPages;
            const end = start + itemsPerPages;

            newBlogs = blogs.slice(start, end);
            // console.log(newBlogs);
            // page = undefined;
            return res.render('blog', { newBlogs, usernameCookie, numberOfPages, page });
        }

        

    },
    showBlogWithPagination: async (req, res) => {
        page = req.body.page;
        console.log('page', page);
        res.status(200).json('ok!');
    },
    createBlog: async (req, res) => {
        try {
            let imagePath = null;
            console.log(req.body.image);
            // Nếu có file ảnh, lấy đường dẫn
            if (req.file) {
                imagePath = `/uploads/${req.file.filename}`;
            }
            console.log(imagePath);
            await db.run('INSERT INTO blogs (author, content, image) VALUES (?, ?, ?)', [req.body.author, req.body.content, imagePath], function (err) {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              });
            return res.status(201).json({ message: "Bài viết đã được đăng!" });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    editBlog: async (req, res) => {
        const id = req.params.id;
        console.log(id);

        await db.run(
            'UPDATE blogs SET content = ? WHERE id = ?',
            [req.body.content, id],
            function (err) {
              if (err) {
                console.error('Lỗi khi cập nhật blog:', err.message);
                return res.status(500).json({ error: err.message });
              }
              if (this.changes === 0) {
                return res.status(404).json({ error: 'Blog không tồn tại' });
              }
              return res.status(200).json({ message: 'Updated successfully!' });
            }
          );
    },

    deleteBlog: async (req, res) => {
        await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id], function (err) {
            if (err) {
              console.error('Lỗi khi xóa blog:', err.message);
              return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
              return res.status(404).json({ error: 'Blog không tồn tại' });
            }
            res.status(200).json({ message: 'Deleted successfully!' });
        });
    }

}

module.exports = blogController