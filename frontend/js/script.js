function toggleForm() {
    document.querySelector('.auth-form--login').classList.toggle('hidden');
    document.querySelector('.auth-form--register').classList.toggle('hidden');
}

function login() {
    alert('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => {
        window.location.href = "main.html"; // Chuyển sang trang chính
    }, 1000);
}

function register() {
    alert('Đăng ký thành công! Chuyển về trang đăng nhập...');
    setTimeout(() => {
        toggleForm();
    }, 1000);
}

