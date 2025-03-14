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

// Hàm kiểm tra quyền của user
const checkUserPermission = (userRole, action) => {
    const permissions = {
        'viewer': ['view'],
        'collaborator': ['view', 'edit'],
        'editor': ['view', 'edit', 'delete']
    };
    
    return permissions[userRole]?.includes(action) || false;
};

// Hàm kiểm tra quyền xem bài viết
const canViewBlog = (userRole) => {
    return checkUserPermission(userRole, 'view');
};

// Hàm kiểm tra quyền chỉnh sửa bài viết
const canEditBlog = (userRole) => {
    return checkUserPermission(userRole, 'edit');
};

// Hàm kiểm tra quyền xóa bài viết
const canDeleteBlog = (userRole) => {
    return checkUserPermission(userRole, 'delete');
};

module.exports = {
    createBlogTable,
    checkUserPermission,
    canViewBlog,
    canEditBlog,
    canDeleteBlog
};