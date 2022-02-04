var login = {
    isBind: false,
    externalProvider: null,
    init: function (isBind, provider, returnUrl) {
		returnUrl = returnUrl || new URLSearchParams(window.location.search.toLowerCase()).get('returnurl');
        this.isBind = isBind;
        this.externalProvider = provider;
        var _this = this;
        $('#logname').focus();
        //用户在页面没进行任何操作的时候，无法获取到密码框中内容，所以通过用户名来判断密码是否有填充 必须是异步操作
        setTimeout(function () {
            $('#logname').val() === "" ? $("#logpwd").removeClass('fill') : $("#logpwd").addClass('fill');
        }, 50)
        $.map($('.bzy-form-control').find('input:text'), function (el) {
            $(el).val() === '' ? $(el).removeClass('fill') : $(el).addClass('fill');
        });
        $('.bzy-form-control').on('change', 'input', function () {
            $(this).val() === '' ? $(this).removeClass('fill') : $(this).addClass('fill');
        });
        $('.bzy-form-control').on('keydown', 'input', function () {
            var keyCode = getKeyCode()
            if (keyCode != 13)
                $(this).parent().find("div.error-tips").text("");
        });
        $('#login').click(function () {
            login();
        });
        $("#logcheckcode").keydown(function () {
            var keyCode = getKeyCode()
            if (keyCode == 13 && $(this).val()) {
                login();
            }
        });
        $('#logname,#logpwd,#logcheckcode').change(function () {
            var val = $(this).val();
            var id = $(this)[0].id;
            var messageBox = $(this).siblings("div.error-tips");
            if (!val) {
                var message;
                if (id == "logname")
                    message = "请输入用户名/手机号/邮箱";
                else if (id == "logpwd")
                    message = "请输入密码";
                else
                    message = "请输入验证码";
                messageBox.text(message);
            }
            else {
                messageBox.text("");
            }
            $("#returnErr").text("");
        });
        function login() {
            $("#login").attr("disabled", "disabled");
            var txt = $("#login").text();
            if (txt.indexOf('中') === -1) {
                $("#login").text(txt + "中...");
            }
            var name = $("#logname").val();
            var pwd = $("#logpwd").val();
            var code = $("#logcheckcode").val();
            $(".bzy-form-control").find(".error-tips").text("");
            var isOk = true;
            if (!name) {
                $("#logname").siblings("div.error-tips").text("请输入用户名");
                isOk = false;
            }
            if (!pwd) {
                $("#logpwd").siblings("div.error-tips").text("请输入登录密码");
                isOk = false;
            }
            if (!code) {
                $("#logcheckcode").siblings("div.error-tips").text("请输入验证码");
                isOk = false;
            }
            if (!isOk) {
                $("#login").text(txt);
                $("#login").removeAttr("disabled");
                return;
            }
            $.post("/account/ajaxlogin",
                {
                    Username: name,
                    Password: pwd,
                    CheckCode: code
                }, function (data, status) {

                    if (data.status == 1) {
                        if (_this.isBind) {
                            _this.bindExternal();
                        } else {
                            localStorage.setItem('bazhuayu',name);
                            if (returnUrl) {
                                switchToUrl(returnUrl, true);
                            }
                            else {
                                switchToUrl("/account/userprofile", true);
                            }
                        }
                    }
                    else {
                        $("#returnErr").text(data.message);
                    }
                    $("#login").text(txt);
                    $("#login").removeAttr("disabled");
                });
        }
    },
    bindExternal: function () {
        var _this = this;
        $.ajax({
            url: "/account/AjaxExternalBind",
            type: "post",
            data: { provider: _this.externalProvider },
            success: function (r) {
                if (r.status != 1) {
                    layer.alert(r.message);
                }
                else {
                    if (_this.boundCallback)
                        _this.boundCallback(r);
                    else
                        switchToUrl("/account/userprofile");
                }
            }
        })
    },
    boundCallback: null
};