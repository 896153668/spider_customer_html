$(document).ready(function () {
    $('#username input:first').focus();

    $('.bzy-form-control').on('change', 'input', function () {
        $(this).val() === '' ? $(this).removeClass('fill') : $(this).addClass('fill');
    });

    $("#phone").change(function () {
        $(this).siblings("div").text("");
    });

    $("#captcha").change(function () {
        $(this).siblings("div").text("");
    });

    $("#passwordResetByEmailBtn").click(function () {
        var btn = $(this);
        btn.attr("disabled", "disabled");

        var usernameInput = $("#username");
        var emailInput = $("#email");

        var username = usernameInput.val();
        var email = emailInput.val();

        var valid = true;

        if (!username) {
            usernameInput.siblings("div.error-tips").text("请输入用户名");
            valid = false;
        }
        if (!email) {
            emailInput.siblings("div.error-tips").text("请输入邮箱");
            valid = false;
        }
        else if (!checkEmail(email)) {
            emailInput.siblings("div.error-tips").text("请输入正确的邮箱地址");
            valid = false;
        }

        if (valid) {
            $.ajax({
                url: "/account/passwordResetByEmail",
                type: "post",
                data: { username: username, email: email },
                success: function (result) {
                    switchToUrl(result.url);
                },
                error: function (xhr) {
                    var errorResult = JSON.parse(xhr.responseText);
                    layer.alert(errorResult.errorDescription);
                    btn.removeAttr("disbaled");
                }
            });
        } else {
            btn.removeAttr("disabled");
        }
    });

    $("#passwordResetByPhoneBtn").click(function () {
        var btn = $(this);
        btn.attr("disabled", "disabled");

        var phoneInput = $("#phone");
        var smsCodeInput = $("#smsCode");

        var phone = phoneInput.val();
        var smsCode = smsCodeInput.val();

        var valid = true;

        if (!phone) {
            phoneInput.siblings("div.error-tips").text("请输入手机号码");
            valid = false;
        }
        else if (!checkMobile(phone)) {
            phoneInput.siblings("div.error-tips").text("请输入正确的手机号码");
            valid = false;
        }

        if (smsCode.length < 4) {
            smsCodeInput.siblings("div.error-tips").text("请输入短信验证码");
            valid = false;
        }

        if (valid) {
            $.ajax({
                url: "/account/passwordResetByPhone",
                type: "post",
                data: { phone: phone, smsCode: smsCode },
                success: function (result) {
                    switchToUrl(result.url);
                },
                error: function (xhr, status, errorThrown) {
                    var errorResult = JSON.parse(xhr.responseText);
                    if (errorResult.errorCode === "SmsCodeError") {
                        smsCodeInput.siblings("div.error-tips").text("短信验证码错误");
                    } else {
                        layer.alert(errorResult.errorDescription);
                    }

                    btn.removeAttr("disbaled");
                }
            });
        } else {
            btn.removeAttr("disbaled");
        }
    });

    var timeCount = 60;
    var interval;
    $(".send-verify-code").click(function () {
        var btn = $(this);
        var passwordResetByPhoneBtn = $("#passwordResetByPhoneBtn");

        var phoneInput = $("#phone");
        var captchaInput = $("#captcha");

        var phone = phoneInput.val();
        var captcha = captchaInput.val();

        var valid = true;

        if (!phone) {
            phoneInput.siblings("div.error-tips").text("请输入手机号码");
            valid = false;
        }
        else if (!checkMobile(phone)) {
            phoneInput.siblings("div.error-tips").text("手机号码不正确");
            valid = false;
        }

        if (captcha.length < 4) {
            captchaInput.siblings("div.error-tips").text("请输入图形验证码");
            valid = false;
        }

        if (!valid) {
            btn.removeAttr("disabled");
            return false;
        }

        btn.attr("disabled", "disabled");

        interval = self.setInterval(function () {
            timeCount--;
            if (timeCount === 0) {
                window.clearInterval(interval);
                timeCount = 60;
                btn.removeAttr("disabled");
                btn.text("重新获取短信验证码");
            } else {
                btn.text(timeCount + "秒后重新获取");
            }
        }, 1000);

        $("#smsCode").focus();

        $.ajax({
            type: "POST",
            url: "/smscode/send",
            data: { phone: phone, captcha: captcha, type: 1 },
            success: function (succeed) {
                if (succeed) {
                    passwordResetByPhoneBtn.removeAttr("disabled");
                } else {
                    layer.alert("发送短信验证码失败，请稍后重试");
                }
            },
            error: function (xhr, status, errorThrown) {
                var errorResult = JSON.parse(xhr.responseText);
                layer.alert(errorResult.errorDescription);
            }
        });
    });

    $('.tab-group').on("click", '.tab', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        var tab = $('.page').hide().eq(index);
        tab.show();
        if (tab.has("img")) {
            tab.find("img").attr("src", "/captcha/code?type=3");
        }
        else {
            tab.find("img").removeAttr("src");
        }
        tab.find("input:first").focus();
    });
});