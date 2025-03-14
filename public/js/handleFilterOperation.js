document.addEventListener('DOMContentLoaded', function () {
    const userTable = document.getElementById('userTable');
    const blockUserModal = new bootstrap.Modal(document.getElementById('blockUserModal'));
    let currentUserId = null;

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function () {
        const filter = searchInput.value.toLowerCase();
        const rows = userTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const name = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();

            if (name.includes(filter) || email.includes(filter)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Xử lý lọc trạng thái
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterBlocked = document.getElementById('filterBlocked');

    filterAll.addEventListener('click', function () {
        const rows = userTable.querySelectorAll('tbody tr');
        rows.forEach(row => row.style.display = '');
    });

    filterActive.addEventListener('click', function () {
        const rows = userTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const status = row.querySelector('.badge').textContent;
            row.style.display = status === 'Hoạt động' ? '' : 'none';
        });
    });

    filterBlocked.addEventListener('click', function () {
        const rows = userTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const status = row.querySelector('.badge').textContent;
            row.style.display = status === 'Đã khóa' ? '' : 'none';
        });
    });

    // Xử lý cập nhật trạng thái nút filter
    function updateFilterButtons(activeButton) {
        [filterAll, filterActive, filterBlocked].forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
        });
        activeButton.classList.remove('btn-outline-secondary');
        activeButton.classList.add('btn-primary');
    }

    [filterAll, filterActive, filterBlocked].forEach(btn => {
        btn.addEventListener('click', function () {
            updateFilterButtons(this);
        });
    });

});