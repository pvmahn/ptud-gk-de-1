document.addEventListener('DOMContentLoaded', function() {
    // const content = document.getElementById("postContent").value.trim();
    const author = document.getElementById("user-name").textContent;

    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    let uploadedImage = null;

    // Xử lý khi người dùng chọn ảnh
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                imagePreview.src = reader.result;
                imagePreview.style.display = 'block';
                removeImageBtn.style.display = 'inline-block';
                uploadedImage = file;
            });
            
            reader.readAsDataURL(file);
        }
    });

    // Xử lý khi người dùng xóa ảnh
    removeImageBtn.addEventListener('click', function() {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        imageUpload.value = '';
        uploadedImage = null;
    });

    // Bổ sung xử lý gửi ảnh khi đăng bài
    const submitPostBtn = document.getElementById('submitPost');
    const postContentTextarea = document.getElementById('postContent');

    // Thay thế hoặc bổ sung xử lý đăng bài hiện tại
    submitPostBtn.addEventListener('click', function() {
        const content = postContentTextarea.value.trim();
        
        if (!content && !uploadedImage) {
            alert('Vui lòng nhập nội dung hoặc thêm ảnh!');
            return;
        }

        console.log(uploadedImage);
        
        // Tạo FormData để gửi cả văn bản và ảnh
        const formData = new FormData();
        formData.append('content', content);
        formData.append('author', author);
        
        if (uploadedImage) {
            formData.append('image', uploadedImage);
        }
        
        // Gửi dữ liệu bài viết lên server (cần cập nhật theo API của bạn)
        fetch('/api/posts', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý sau khi đăng bài thành công
            postContentTextarea.value = '';
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            removeImageBtn.style.display = 'none';
            imageUpload.value = '';
            uploadedImage = null;
            
            alert("Đăng bài thành công!");
            // Làm mới trang hoặc thêm bài viết mới vào DOM
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã có lỗi xảy ra khi đăng bài!');
        });
    });
});
