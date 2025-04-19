function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var checkbox = document.getElementById('showPassword');

    if (checkbox.checked) {
        passwordInput.type = 'text';  // Show password
    } else {
        passwordInput.type = 'password';  // Hide password
    }
}