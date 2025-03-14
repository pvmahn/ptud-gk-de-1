document.addEventListener('DOMContentLoaded', function () {
    // Chức năng lọc bài viết
    const showAllButton = document.getElementById('showAllPosts');
    const showMyButton = document.getElementById('showMyPosts');
    const allPosts = document.querySelectorAll('.post-card');
    const myPosts = document.querySelectorAll('.post-current-user');
    const otherPosts = document.querySelectorAll('.post-other-user');

    // Ban đầu hiển thị tất cả bài viết
    showAllPosts();

    // Sự kiện cho nút "Tất cả bài viết"
    showAllButton.addEventListener('click', function () {
        showAllPosts();
    });

    // Sự kiện cho nút "Bài viết của tôi"
    showMyButton.addEventListener('click', function () {
        showMyPosts();
    });

    // Hàm hiển thị tất cả bài viết
    function showAllPosts() {
        allPosts.forEach(post => {
            post.style.display = 'block';
        });

        showAllButton.classList.add('filter-active');
        showMyButton.classList.remove('filter-active');
    }

    // Hàm chỉ hiển thị bài viết của người dùng hiện tại
    function showMyPosts() {
        console.log(myPosts);
        myPosts.forEach(post => {
            post.style.display = 'block';
        });

        otherPosts.forEach(post => {
            post.style.display = 'none';
        });

        showMyButton.classList.add('filter-active');
        showAllButton.classList.remove('filter-active');
    }

    // Chức năng chỉnh sửa bài viết
    const editButtons = document.querySelectorAll('.edit-post-btn');
    const cancelEditButtons = document.querySelectorAll('.cancel-edit-btn');
    const saveEditButtons = document.querySelectorAll('.save-edit-btn');

    // Sự kiện cho nút chỉnh sửa
    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            const post = document.getElementById(postId);
            const postContent = post.querySelector('.post-text');
            const editControls = post.querySelector('.editing-controls');
            const editTextarea = post.querySelector('.edit-textarea');

            // Hiển thị form chỉnh sửa và ẩn nội dung hiện tại
            postContent.style.display = 'none';
            editControls.style.display = 'block';

            // Đặt nội dung hiện tại vào textarea
            editTextarea.value = postContent.textContent;
            editTextarea.focus();
        });
    });

    // Sự kiện cho nút hủy chỉnh sửa
    cancelEditButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            const post = document.getElementById(postId);
            const postContent = post.querySelector('.post-text');
            const editControls = post.querySelector('.editing-controls');

            // Ẩn form chỉnh sửa và hiển thị lại nội dung
            postContent.style.display = 'block';
            editControls.style.display = 'none';
        });
    });

    // Sự kiện cho nút lưu chỉnh sửa
    saveEditButtons.forEach(button => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            const post = document.getElementById(postId);
            const postContent = post.querySelector('.post-text');
            const editControls = post.querySelector('.editing-controls');
            const editTextarea = post.querySelector('.edit-textarea');

            // Lấy nội dung bài viết
            const updatedContent = editTextarea.value;

            // Gửi dữ liệu cập nhật về backend
            try {
                const response = await fetch(`/api/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: updatedContent })
                });

                if (response.ok) {
                    // Cập nhật giao diện nếu backend xử lý thành công
                    postContent.textContent = updatedContent;
                    postContent.style.display = 'block';
                    editControls.style.display = 'none';

                    alert('Bài viết đã được cập nhật thành công!');
                } else {
                    alert('Có lỗi xảy ra, vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật bài viết:', error);
                alert('Lỗi kết nối, vui lòng thử lại sau!');
            }
        });
    });

    // Chức năng xóa bài viết
    const deleteButtons = document.querySelectorAll('.delete-post-btn');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    let postToDelete = null;

    // Sự kiện cho nút xóa (mở modal xác nhận)
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();
            // Lưu ID bài viết sẽ xóa
            postToDelete = this.getAttribute('data-post-id');
        });
    });

    // Sự kiện cho nút xác nhận xóa trong modal
    confirmDeleteButton.addEventListener('click', async function () {
        if (postToDelete) {
            const post = document.getElementById(postToDelete);

            // Hiệu ứng fade out trước khi xóa
            post.style.transition = 'opacity 0.3s';
            post.style.opacity = '0';

            // Gửi dữ liệu cập nhật về backend
            try {
                const response = await fetch(`/api/posts/${postToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Bài viết đã được xóa thành công!');
                    window.location.reload();

                } else {
                    alert('Có lỗi xảy ra, vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật bài viết:', error);
                alert('Lỗi kết nối, vui lòng thử lại sau!');
            }

            // Xóa phần tử sau khi hoàn thành hiệu ứng
            setTimeout(() => {
                post.remove();
            }, 300);

            // Reset biến
            postToDelete = null;
        }
    });
});