document.addEventListener('DOMContentLoaded', function () {
    const userTable = document.getElementById('userTable');
    const blockUserModal = new bootstrap.Modal(document.getElementById('blockUserModal'));
    let currentUserId = null;

    console.log('test1');

    // Xử lý sự kiện khóa người dùng
    userTable.addEventListener('click', function (e) {
        if (e.target.closest('.btn-block-user')) {
            currentUserId = e.target.closest('.btn-block-user').getAttribute('data-user-id');
            blockUserModal.show();
        }
    });

    // Xác nhận khóa người dùng
    document.getElementById('confirmBlockUser').addEventListener('click', async function () {
        const row = document.querySelector(`[data-user-id="${currentUserId}"]`).closest('tr');
        const statusBadge = row.querySelector('.badge');

        // Thay đổi trạng thái và nút
        statusBadge.classList.remove('bg-success');
        statusBadge.classList.add('bg-danger');
        statusBadge.textContent = 'Đã khóa';

        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-warning btn-reset-password" data-user-id="${currentUserId}">
                    <i class="bi bi-key"></i> Reset MK
                </button>
                <button class="btn btn-sm btn-success btn-unblock-user" data-user-id="${currentUserId}">
                    <i class="bi bi-unlock"></i> Mở khóa
                </button>
            </div>
        `;

        //gửi thông tin về backend
        try {
            const response = await fetch("admin/api/block-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "userid": currentUserId,
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Đã block người dùng có ID: ${currentUserId}`);
                blockUserModal.hide();
            } else {
                alert("Lỗi: " + result.error);
            }
        } catch (err) {
            alert('Lỗi', err);
        }

    });

    // Xử lý mở khóa người dùng
    userTable.addEventListener('click', async function (e) {
        if (e.target.closest('.btn-unblock-user')) {
            const userId = e.target.closest('.btn-unblock-user').getAttribute('data-user-id');
            const row = e.target.closest('tr');
            const statusBadge = row.querySelector('.badge');

            // Thay đổi trạng thái và nút
            statusBadge.classList.remove('bg-danger');
            statusBadge.classList.add('bg-success');
            statusBadge.textContent = 'Hoạt động';

            const actionCell = row.querySelector('td:last-child');
            actionCell.innerHTML = `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-warning btn-reset-password" data-user-id="${userId}">
                        <i class="bi bi-key"></i> Reset MK
                    </button>
                    <button class="btn btn-sm btn-danger btn-block-user" data-user-id="${userId}">
                        <i class="bi bi-lock"></i> Khóa
                    </button>
                </div>
            `;

            //gửi thông tin về backend
            try {
                const response = await fetch("admin/api/unblock-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "userid": currentUserId,
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`Đã mở khóa người dùng có ID: ${currentUserId}`);
                } else {
                    alert("Lỗi: " + result.error);
                }
            } catch (err) {
                alert('Lỗi', err);
            }
        }
    });
});