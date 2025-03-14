document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn form reload trang

        const username = document.getElementById("firstName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        console.log(typeof (password));

        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const response = await fetch("/auth/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "username": username,
                    "email": email,
                    "password": password
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
                window.location.href = "/auth/login";
            } else {
                alert("Lỗi: " + result.error);
            }
        } catch (error) {
            console.error("Lỗi kết nối đến server:", error);
            alert("Lỗi kết nối đến server. Vui lòng thử lại!");
        }
    });
});
