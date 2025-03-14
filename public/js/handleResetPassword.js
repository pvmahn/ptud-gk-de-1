document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn form reload trang

        const username = document.getElementById("firstName").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            password = null;
            confirmPassword = null;
            alert("2 ô mật khẩu và xác nhận mật khẩu phải trùng khớp với nhau.");
        } else {
            try {
                const response = await fetch("/auth/api/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "username": username,
                        "password": password
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result);
                    window.location.href = "/auth/login";
                } else {
                    alert("Có lỗi trong quá trình đổi mật khẩu. Kiểm tra user đã nhập đúng chưa? ");
                }
            } catch (error) {
                console.error("Lỗi kết nối đến server:", error);
                alert("Lỗi kết nối đến server. Vui lòng thử lại!");
            }
        }
    });
});
