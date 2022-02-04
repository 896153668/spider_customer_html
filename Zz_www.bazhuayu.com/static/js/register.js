function getQueryString(name) {
 var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
 var r = window.location.search.substr(1).match(reg);
 if (r != null) {
  return unescape(r[2]);
 }
 return null;
}

$(function () {
    $(".deal input[type='checkbox']").click(function () {
        if ($(this).prop('checked')) {
            $(".register-btn").removeAttr("disabled");
        } else {
            $(".register-btn").attr("disabled", "disabled");
        }
    });

    $("#registerByEmailForm .licence-check input[type='checkbox']").click(function () {
        if ($(this).prop('checked')) {
            $("#registerByEmailBtn").removeAttr("disabled");
        } else {
            $("#registerByEmailBtn").attr("disabled", "disabled");
        }
    });

    $("#registerByPhoneForm .licence-check input[type='checkbox']").click(function () {
        if ($(this).prop('checked')) {
            $("#registerByPhoneBtn").removeAttr("disabled");
        } else {
            $("#registerByPhoneBtn").attr("disabled", "disabled");
        }
    });

    $(".register-btn").click(function () {
        var emailOrPhone = $("#emailOrPhone").val();
        switchRegisterPage($(this), emailOrPhone);
    });

    $("#emailOrPhone").keydown(function () {
        var keyCode = getKeyCode();
        if (keyCode === 13 && $(this).val()) {
            $(".register-btn").click();
        } 
    });

    $("#registerByEmailBtn").click(function () {
        var self = this;
        var originBtnText = $(self).text();

        $(self).text("注册中...");
        $(self).attr("disabled", "disabled");

        var usernameInput = $("#registerByEmailForm #username");
        var passwordInput = $("#registerByEmailForm #password");
        var captchaInput = $("#registerByEmailForm #captcha");

        var email = $("#emailOrPhone").val();
        var username = usernameInput.val();
        var password = passwordInput.val();
        var captcha = captchaInput.val();

        var valid = true;
        if (!checkUsername(username)) {
            usernameInput.siblings("div.error-tips").text("用户名6-16位字母/数字，且不能是数字开头");
            valid = false;
        }
        if (captcha.length < 4) {
            captchaInput.siblings("div.error-tips").text("请输入图形验证码！");
            valid = false;
        }
        if (!checkPassword(password)) {
            passwordInput.siblings("div.error-tips").text("密码6-16位，且至少包含2种不同字符");
            valid = false;
        }

        if (valid) {
            $.ajax({
                type: "POST",
                url: "/account/registerByEmail",
                data: { username: username, password: password, captcha: captcha, email: email, returnUrl: getQueryString("returnUrl"), from: getQueryString("from"), channelUid: getQueryString("uid") },
                success: function (result) {
                    if (result.isExternalLogin) {
                        if (result.bindSucceed) {
                            switchToUrl("/account/registerSucceed?registerBy=0&isBind=true");
                        }
                        else {
                            switchToUrl("/external/bindResult?succeed=false&errorMessage=" + encodeURI(result.errorMessage));
                        }
                    }
                    else {
                        switchToUrl("/account/registerSucceed?registerBy=0");
                    }
                },
                error: function (xhr, status, errorThrown) {
                    var errorResult = JSON.parse(xhr.responseText);
                    if (errorResult.field === "Captcha") {
                        captchaInput.siblings("div.error-tips").text(errorResult.errorDescription);
                    } else {
                        layer.alert(errorResult.errorDescription);
                    }

                    $(self).text(originBtnText);
                    $(self).removeAttr("disabled");
                }
            });
        } else {
            $(self).text(originBtnText);
            $(self).removeAttr("disabled");
        }
    });

    $("#registerByEmailForm #captcha").keydown(function () {
        var keyCode = getKeyCode();
        if (keyCode === 13 && $(this).val()) {
            $("#registerByEmailBtn").click();
        }
    });

    $("#registerByPhoneBtn").click(function () {
        var self = this;
        var originBtnText = $(self).text();

        $(self).text("注册中...");
        $(self).attr("disabled", "disabled");

        var passwordInput = $("#registerByPhoneForm #password");
        var smsCodeInput = $("#registerByPhoneForm #smsCode");

        var phone = $("#emailOrPhone").val();
        var password = passwordInput.val();
        var smsCode = smsCodeInput.val();

        var valid = true;
        if (!checkPassword(password)) {
            passwordInput.siblings("div.error-tips").text("密码6-16位，且至少包含2种不同字符");
            valid = false;
        }
        if (smsCode.length < 4) {
            smsCodeInput.siblings("div.error-tips").text("请输入正确的短信验证码");
            valid = false;
        }

        if (valid) {
            $.ajax({
                type: "POST",
                url: "/account/registerByPhone",
                data: { password: password, phoneNumber: phone, smsCode: smsCode, from: getQueryString("from"), channelUid: getQueryString("uid")  },
                success: function (result) {
                    if (result.isExternalLogin) {
                        if (result.bindSucceed) {
                            switchToUrl("/account/registerSucceed?registerBy=1&isBind=true");
                        }
                        else {
                            switchToUrl("/external/bindResult?succeed=false&errorMessage=" + encodeURI(result.errorMessage));
                        }
                    }
                    else {
                        switchToUrl("/account/registerSucceed?registerBy=1");
                    }
                },
                error: function (xhr, status, errorThrown) {
                    var errorResult = JSON.parse(xhr.responseText);
                    if (errorResult.errorCode === "SmsCodeError") {
                        smsCodeInput.siblings("div.error-tips").text("短信验证码错误");
                    } else {
                        layer.alert(errorResult.errorDescription);
                    }

                    $(self).text(originBtnText);
                    $(self).removeAttr("disabled");
                }
            });
        } else {
            $(self).text(originBtnText);
            $(self).removeAttr("disabled");
        }
    });

    $("#registerByPhoneForm #smsCode").keydown(function () {
        var keyCode = getKeyCode();
        if (keyCode === 13 && $(this).val()) {
            $("#registerByPhoneBtn").click();
        }
    });

    $("#changeMobile,#changeEmail").click(function () {
        $('.main-content').removeClass('step-2').addClass('step-1');
        $('.register-btn').show().siblings().hide();
        $('.sub-page.p-1').css({ display: 'flex' }).siblings().css({ display: 'none' });
        $('.step-1 .user input').focus();
    });

    function switchRegisterPage(registerBtn, emailOrPhone) {
        var originRegisterBtnText = registerBtn.text();

        registerBtn.text("注册中...");
        registerBtn.attr("disabled", "disabled");

        var registerType = "";

        if (checkEmail(emailOrPhone)) {
            registerType = "email";
        } else if (checkMobile(emailOrPhone)) {
            registerType = "phone";
        } else {
            $("#emailOrPhone").siblings("div.error-tips").text("请输入正确的手机号或邮箱。");

            registerBtn.text(originRegisterBtnText);
            registerBtn.removeAttr("disabled");

            return false;
        }

        var checkUrl = registerType === "email"
            ? "/account/isEmailUnique?email="
            : "/account/isPhoneUnique?phone=";

        $.get(checkUrl + emailOrPhone, function (isUnique) {
            if (isUnique === true) {
                $('.main-content').removeClass('step-1').addClass('step-2');
                if (registerType === "phone") {
                    $('.register-mobile').show().siblings().hide();
                    /*解决tabindex 问题*/
                    $('.sub-page.p-2').find('input').removeAttr('tabindex');
                    $('.sub-page.p-2').find('a').removeAttr('tabindex');
                    $('.sub-page.p-2').css({ display: 'flex' }).siblings().css({ display: 'none' });

                    $("#registerByPhoneForm input:visible:first").focus();
                } else if (registerType === "email") {
                    $("#registerByEmailForm #captcha").siblings("img").attr("src", "/captcha/code?type=1");
                    $('.register-email').show().siblings().hide();
                    /*解决tabindex 问题*/
                    $('.sub-page.p-3').find('input').removeAttr("tabindex");
                    $('.sub-page.p-3').find('a').removeAttr("tabindex");
                    $('.sub-page.p-3').css({ display: 'flex' }).siblings().css({ display: 'none' });

                    $("#registerByEmailForm input:visible:first").focus();
                }
            } else {
                var errorMessage = "该" + (registerType === "email" ? "邮箱" : "手机") + "已经存在，请重新输入"; 
                $("#emailOrPhone").siblings("div.error-tips").text(errorMessage);
            }

            registerBtn.text(originRegisterBtnText);
            registerBtn.removeAttr("disabled");
        });
    }
});

window.callback = function (res) {
    if (res.ret === 0) {
        var captchaTicket = { ticket: res.ticket, randstr: res.randstr };
        sendSmsCode(captchaTicket);
    }
};

var timeCount = 60;
function sendSmsCode(captchaTicket) {
    var phone = $("#emailOrPhone").val();
    var sendSmsCodeBtn = $("#TencentCaptcha");
    var registerByPhoneBtn = $("#registerByPhoneBtn");
    var messageBox = $("#registerByPhoneForm #smsCode").siblings("div.error-tips");

    messageBox.text("");
    if (!phone) {
        messageBox.text("请填写手机号码！");
        return;
    }
    if (!checkMobile(phone)) {
        messageBox.text("手机号码不正确！");
        return;
    }

    registerByPhoneBtn.attr("disabled", "disabled");
    sendSmsCodeBtn.attr("disabled", "disabled");

    interval = self.setInterval(function () {
        timeCount--;
        if (timeCount === 0) {
            window.clearInterval(interval);
            timeCount = 60;
            sendSmsCodeBtn.removeAttr("disabled");
            sendSmsCodeBtn.text("重新获取短信验证码");
        } else {
            sendSmsCodeBtn.text(timeCount + "秒后重新获取");
        }
    }, 1000);

    $("#registerByPhoneForm #smsCode").focus();

    $.ajax({
        type: "POST",
        url: "/smscode/sendV2",
        data: { phone: phone, ticket: captchaTicket.ticket, randCode: captchaTicket.randstr, type: 0 },
        success: function (succeed) {
            if (succeed) {
                registerByPhoneBtn.removeAttr("disabled");
            } else {
                layer.alert("发送短信验证码失败，请稍后重试");
            }
        },
        error: function (xhr, status, errorThrown) {
            var errorResult = JSON.parse(xhr.responseText);
            layer.alert(errorResult.errorDescription);
        }
    });
}