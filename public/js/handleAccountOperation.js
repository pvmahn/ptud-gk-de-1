document.addEventListener('DOMContentLoaded', function () {
    const userTable = document.getElementById('userTable');
    const resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
    const blockUserModal = new bootstrap.Modal(document.getElementById('blockUserModal'));
    let currentUserId = null;

    console.log('test1');

    // Xử lý sự kiện reset mật khẩu
    userTable.addEventListener('click', function (e) {
        console.log('test');
        if (e.target.closest('.btn-reset-password')) {
            currentUserId = e.target.closest('.btn-reset-password').getAttribute('data-user-id');
            resetPasswordModal.show();
        }
    });

    // Xác nhận reset mật khẩu
    document.getElementById('confirmResetPassword').addEventListener('click', async function () {
        try {
            //gửi request cho backend
            const response = await fetch("admin/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "userid": currentUserId,
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Đã reset mật khẩu cho người dùng có ID: ${currentUserId}`);
                resetPasswordModal.hide();
            } else {
                alert("Lỗi: " + result.error);
            }
        } catch (err) {
            alert('Lỗi', err);
        }
    });
});