$(document).ready(function () {
    $("#loginForm input[name='Captcha']").keydown(function () {
        var keyCode = getKeyCode();
        if (keyCode === 13 && $(this).val()) {
            $("button.login").click();
        }
    });

    $("#loginForm button.login").click(function (e) {
        var valid = validate();
        if (!valid) {
            e.preventDefault();
            e.stopPropagation();

            return false;
        }
    });

    function validate() {
        $("#returnErr").text("");

        var loginNameInput = $("#loginForm input[name='LoginName']");
        var passwordInput = $("#loginForm input[name='Password']");
        var captchaInput = $("#loginForm input[name='Captcha']");

        var valid = true;

        if (!loginNameInput.val()) {
            loginNameInput.siblings("div.error-tips").text("请输入用户名");
            valid = false;
        }
        if (!passwordInput.val()) {
            passwordInput.siblings("div.error-tips").text("请输入密码");
            valid = false;
        }
        if (!captchaInput.val()) {
            captchaInput.siblings("div.error-tips").text("请输入验证码");
            valid = false;
        }

        return valid;
    }
});