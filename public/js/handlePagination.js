document.querySelectorAll('.page-item:not(#prev-page):not(#next-page)').forEach((element, index) => {
    element.addEventListener('click', async function () {
        const pageId = this.getAttribute('data-page');
        const page = document.getElementById(pageId);

        if (index + 1 === pageId) page.classList.add('active');
        else page.classList.remove('active');

        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page: pageId })
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        }
    })
});