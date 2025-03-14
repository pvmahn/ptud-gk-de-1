const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router()

const blogController = require('../controllers/blogController');

// Cấu hình multer để lưu file vào thư mục uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
  });
  const upload = multer({ storage: storage });
  
  // Tạo thư mục uploads nếu chưa tồn tại
  const fs = require('fs');
  if (!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads');
  }

router.get('/', blogController.showBlog);

router.post('/', blogController.showBlogWithPagination);
router.post('/api/posts', upload.single('image'), blogController.createBlog);

router.put('/api/posts/:id', blogController.editBlog);
router.delete('/api/posts/:id', blogController.deleteBlog);

module.exports = router;