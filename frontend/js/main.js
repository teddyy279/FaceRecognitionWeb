// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function() {
    // Tìm phần tử có class .js-logout
    const logoutButton = document.querySelector('.js-logout');

    // Gắn sự kiện click vào nút "Đăng xuất"
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();  // Ngừng hành động mặc định (nếu có)

        // Chuyển hướng về trang đăng nhập index.html
        window.location.href = 'index.html';
    });
});
