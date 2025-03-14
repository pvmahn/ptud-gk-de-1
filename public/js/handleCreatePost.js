// document.getElementById("submitPost").addEventListener("click", async function () {
//     const content = document.getElementById("postContent").value.trim();
//     const author = document.getElementById("user-name").textContent;

//     if (!content) {
//         alert("Vui lòng nhập nội dung bài viết!");
//         return;
//     }

//     // xử lý phần ảnh
//     const imageUpload = document.getElementById('imageUpload');
//     const imagePreview = document.getElementById('imagePreview');
//     const removeImageBtn = document.getElementById('removeImage');
//     let uploadedImage = null;

//     // Xử lý khi người dùng chọn ảnh
//     imageUpload.addEventListener('change', function() {
//         const file = this.files[0];
        
//         if (file) {
//             const reader = new FileReader();
            
//             reader.addEventListener('load', function() {
//                 imagePreview.src = reader.result;
//                 imagePreview.style.display = 'block';
//                 removeImageBtn.style.display = 'inline-block';
//                 uploadedImage = file;
//             });
            
//             reader.readAsDataURL(file);
//         }
//     });

//     // Xử lý khi người dùng xóa ảnh
//     removeImageBtn.addEventListener('click', function() {
//         imagePreview.src = '#';
//         imagePreview.style.display = 'none';
//         removeImageBtn.style.display = 'none';
//         imageUpload.value = '';
//         uploadedImage = null;
//     });

//     // Bổ sung xử lý gửi ảnh khi đăng bài
//     const submitPostBtn = document.getElementById('submitPost');
//     const postContentTextarea = document.getElementById('postContent');

//     console.log(uploadedImage);

//     const response = await fetch("/api/posts", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "author": author,
//             "content": content,
//             "image": uploadedImage,
//         })
//     });

//     const result = await response.json();
//     console.log(result);

//     if (response.ok) {
//         alert("Đăng bài thành công!");
//         window.location.reload();
//         document.getElementById("postContent").value = ""; // Reset ô nhập liệu
//     } else {
//         alert("Có lỗi xảy ra: " + result.error);
//     }
// });