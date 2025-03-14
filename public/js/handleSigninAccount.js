document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn form reload trang

        const username = document.getElementById("firstName").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/auth/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Đăng nhập thành công! Chuyển hướng đến trang chủ");
                window.location.href = "/";
            } else {
                if (result === "reset") {
                    console.log('test reset');
                    alert("Mật khẩu đã bị reset bởi admin. Vui lòng đổi mật khẩu mới!");
                    window.location.href = "/auth/reset-password";
                }
                else alert(result);
            }
        } catch (error) {
            console.error("Lỗi kết nối đến server:", error);
            alert("Lỗi kết nối đến server. Vui lòng thử lại!");
        }
    });
});
