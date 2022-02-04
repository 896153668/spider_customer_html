var signup = {
  isBind: false,
  externalProvider: null,
  init: function (isBind, provider) {
    this.isBind = isBind;
    this.externalProvider = provider;
    var _this = this;
    var interval;
      var timeCount = 60;
      var captchaTicket = {}
    $("#regAccount").focus();
    $.map($('.bzy-form-control').find('input:text'), function (el) {
      $(el).val() === '' ? $(el).removeClass('fill') : $(el).addClass('fill');
    });
    $('.bzy-form-control').on('change', 'input', function () {
      $(this).val() === '' ? $(this).removeClass('fill') : $(this).addClass('fill');
    });
    $('.bzy-form-control').on('keydown', 'input', function () {
      var keyCode = getKeyCode();
      if (keyCode != 13)
        $(this).parent().find("div.error-tips").text("");
    });
    //$('.register-btn').text(isBind ? "绑定八爪鱼账号" : "登录");
    $('.deal input').click(function(){
      if( $('.deal input').prop('checked')){
        $('.register-btn').removeAttr("disabled");
        $('.register-btn').click(function () {
          _this.handleSwitchSubPage();
        });
      }else{
        $('.register-btn').attr("disabled", "disabled");
        $('.register-btn').click(function () {
        });
      }
    });
    $('.register-btn').click(function () {
      _this.handleSwitchSubPage();
    });
    $('#regAccount').keydown(function () {
      var keyCode = getKeyCode();
      if (keyCode == 13) {
        _this.handleSwitchSubPage();
      }
    });
    $(".p-2 input:checkbox").on('change', function () {
      if ($(this).is(":checked")) {
        $("#btnMobileReg").removeAttr("disabled");
      } else {
        $("#btnMobileReg").attr("disabled", "disabled");
      }
    })
    $(".p-3 input:checkbox").on('change', function () {
      if ($(this).is(":checked")) {
        $("#btnEmailReg").removeAttr("disabled");
      } else {
        $("#btnEmailReg").attr("disabled", "disabled");
      }
    })

      function sendVerifyCode() {
      var mobile = $("#regAccount").val();
      var btn = $("#TencentCaptcha");
      var messageBox = $("#mobileCheckCode div.error-tips");
      messageBox.text("");
      //var checkcode = $("#mcheckcode").val();
      if (mobile == "") {
        messageBox.text("请填写手机号码！");
        return;
      }
      //if (checkcode.length < 4) {
      //  messageBox.text("请输入图形验证码后再获取短信验证码！");
      //  return;
      //}
      if (!checkMobile(mobile)) {
        messageBox.text("手机号码不正确！");
        return;
      }
      $("#btnMobileReg").attr("disabled", "disabled");
      btn.attr("disabled", "disabled");
      interval = self.setInterval(function () {
        timeCount--;
        if (timeCount == 0) {
          window.clearInterval(interval);
          timeCount = 60;
          btn.removeAttr("disabled");
          btn.text("重新获取短信验证码");
        } else {
          btn.text(timeCount + "秒后重新获取");
        }
      }, 1000);
      $("#mmsgcode").focus();
          $.post("/account/AjaxGetRegisterSmsCode"
              , { mobile: mobile, checkcode: captchaTicket.ticket, randstr: captchaTicket.randstr }
        , function (result) {
          if (result.status == 1) {
            $("#btnMobileReg").removeAttr("disabled");
            //layer.alert("短信验证码已发送。");
          } else {
            layer.alert("短信验证码发送失败，请重新发送。");
            window.clearInterval(interval);
            timeCount = 60;
            btn.removeAttr("disabled");
            if (result.status == 3) {
              messageBox.text("手机号码" + acc + "格式不正确")
            }
            else {
                            if (result.message) {
                                messageBox.text(result.message);
              }
              else
              {
                messageBox.text("获取短信验证码失败");
              }
            }
          }
        });
    }

    $("#btnMobileReg").click(function () {
      mobileRegister();
    });

    $("#btnEmailReg").click(function () {
      emailRegister();
    });
    $("#mmsgcode").on("keydown", function () {
      var keyCode = getKeyCode();
      if (keyCode == 13 && $(this).val()) {
        mobileRegister();
      }
    });
    $("#echeckcode").keydown(function () {
      var keyCode = getKeyCode();
      if (keyCode == 13 && $(this).val()) {
        emailRegister();
      }
    });

    $("#changeMobile,#changeEmail").click(function () {
      $('.main-content').removeClass('step-2').addClass('step-1');
      $('.register-btn').show().siblings().hide();
      $('.sub-page.p-1').css({ display: 'flex' }).siblings().css({ display: 'none' });
      $('.step-1 .user input').focus();
    });

    function mobileRegister() {
      var $mobile = $("#btnMobileReg");
      $mobile.attr("disabled", "disabled");
      var txt = $mobile.text();
      if (txt.indexOf('中') === -1) {
        $mobile.text(txt + "中...");
      }
      var acc = $("#regAccount").val();
      var data = {};
      data.Mobile = acc;
      data.Password = $("#mpwd").val();
      data.SmsCode = $("#mmsgcode").val();
      $("#mobileMsgCode div.error-tips, #mobilePwd div.error-tips").text("");
      var isOk = true;
      if (data.SmsCode.length < 4) {
        $("#mobileMsgCode div.error-tips").text("请输入正确的短信验证码");
        isOk = false;
      }
      if (!checkPassword(data.Password)) {
        $("#mobilePwd div.error-tips").text("密码6-16位，且至少包含2种不同字符");
        isOk = false;
      }
      if (!isOk) {
        $mobile.text(txt);
        $mobile.removeAttr("disabled");
        return;
      }
      $.post("/account/AjaxRegisterByMobile"
        , data
        , function (r) {
          if (r.status == 1) {
            if (_this.isBind) {
              _this.bindExternal();
            } else {
              switchToUrl("/registerSuccess", true);
            }
          }
          else {
            if (r.status == 2) {
              $("#mobileMsgCode div.error-tips").text("短信验证码错误");
            } else if (r.status == 3) {
              layer.alert("手机号码" + acc + "已经存在");
            } else if (r.status == 10) {
              layer.alert("手机号码" + acc + "格式不正确");
            } else if (r.status == 11) {
              $("#mobilePwd div.error-tips").text("6-16位，且至少包含2种不同字符");
            } else {
              if (r.message)
                layer.alert(r.message);
              else
                layer.alert("手机号码" + acc + "注册失败");
            }
          }
          $mobile.text(txt);
          $mobile.removeAttr("disabled");
        });
    }
    function emailRegister() {
      var $email = $("#btnEmailReg");
      $email.attr("disabled", "disabled");
      var txt = $email.text();
      if (txt.indexOf('中') === -1) {
        $email.text("注册中...");
      }
      var acc = $("#regAccount").val();
      var data = {};
      data.UserName = $("#eusername").val();
      data.Email = acc;
      data.Password = $("#epwd").val();
      data.CheckCode = $("#echeckcode").val();
      $("#emailUserName div.error-tips,#emailCheckCode div.error-tips,#emailpwd div.error-tips").text("");
      var isOk = true;
      if (!checkUsername(data.UserName)) {
        $("#emailUserName div.error-tips").text("用户名6-16位字母/数字，且不能是数字开头");
        isOk = false;
      }
      if (data.CheckCode.length < 4) {
        $("#emailCheckCode div.error-tips").text("请输入图形验证码！");
        isOk = false;
      }
      if (!checkPassword(data.Password)) {
        $("#emailpwd div.error-tips").text("密码6-16位，且至少包含2种不同字符");
        isOk = false;
      }
      if (!isOk) {
        $email.text(txt);
        $email.removeAttr("disabled");
        return;
      }
      $.post("/account/AjaxRegisterByEmail"
        , data
        , function (r) {
          if (r.status == 1) {
            if (_this.isBind) {
              _this.bindExternal();
            } else {
              switchToUrl("/account/ActivateEmailSuccess");
            }
          }
          else {
            if (r.status == 2) {
              $("#emailCheckCode div.error-tips").text("验证码错误");
            } else if (r.status == 3) {
              $("#emailUserName div.error-tips").text("该用户名已存在");
            } else if (r.status == 10) {
              $("#emailUserName div.error-tips").text("用户名6-16位字母/数字，且不能是数字开头");
            } else if (r.status == 4) {
              layer.alert("邮件" + acc + "已经存在");
            } else if (r.status == 12) {
              layer.alert("邮件" + acc + "格式不正确");
            } else if (r.status == 11) {
              $("#emailpwd div.error-tips").text("密码6-16位，且至少包含2种不同字符");
            } else {
              if (r.message)
                layer.alert(r.message);
              else
                layer.alert("手机号码" + acc + "注册失败");
            }
          }
          $email.text(txt);
          $email.removeAttr("disabled");
        });
      }

      window.callback = function (res) {
          //console.log(res)
          // res（用户主动关闭验证码）= {ret: 2, ticket: null}
          // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
          if (res.ret === 0) {
              //alert(res.ticket)   // 票据
              captchaTicket = { ticket: res.ticket, randstr: res.randstr }
              sendVerifyCode();
          } else {
              captchaTicket = {}
          }
      }
  },
  handleSwitchSubPage: function () {
    var $reg = $('.register-btn');
    $reg.attr("disabled", "disabled");
    var txt = $reg.text();
    if (txt.indexOf('中') === -1) {
      $reg.text(txt + "中...");
    }
    var userType = "mobile";
    var url = "";
    var data = {};
    var msg = "";
    var _this = this;
    var userName = $('#regAccount').val()
    $("#emailOrMobile div.error-tips").text("");

    if (checkMobile(userName)) {
      userType = 'mobile';
      url = "/account/AjaxCheckMobile";
      data.mobile = userName;
      msg = "手机号码";

    } else if (checkEmail(userName)) {
      userType = 'email';
      url = "/account/AjaxCheckEmail";
      data.email = userName;
      msg = "邮箱";

    } else {
      $("#emailOrMobile div.error-tips").text("请输入正确的手机号或邮箱。");
      $reg.text(txt);
      $reg.removeAttr("disabled");
      return false;
    }

    $.ajax({
      url: url,
      type: "post",
      data: data,
      success: function (r) {
        if (r.status != 1) {
          if (r.status == 2) {
            $("#emailOrMobile div.error-tips").text("该" + msg + "已经存在，请重新输入");
          } else if (r.status == 3) {
            $("#emailOrMobile div.error-tips").text("请输入正确的" + msg);
          }
        }
        else {
          $('.main-content').removeClass('step-1').addClass('step-2');
          if (userType === "mobile") {
            $("#mobileCheckCode img").attr("src", "/RandomImg?type=3");
            $('.register-mobile').show().siblings().hide();
            /*解决tabindex 问题*/
            $('.sub-page.p-2').find('input').removeAttr('tabindex')
            $('.sub-page.p-2').find('a').removeAttr('tabindex')
            $('.sub-page.p-2').css({ display: 'flex' }).siblings().css({ display: 'none' });
            $("#mpwd").focus();
          } else if (userType === "email") {
            $("#emailCheckCode img").attr("src", "/RandomImg?type=1");
            $('.register-email').show().siblings().hide();
            /*解决tabindex 问题*/
            $('.sub-page.p-3').find('input').removeAttr('tabindex')
            $('.sub-page.p-3').find('a').removeAttr('tabindex')
            $('.sub-page.p-3').css({ display: 'flex' }).siblings().css({ display: 'none' });
            var email = $("#regAccount").val();
            _this.setDefaultUserName(email.substring(0, email.indexOf('@')));
            $("#eusername").focus();
          }
        }
        $reg.text(txt);
        $reg.removeAttr("disabled");
      }
    })
  },
  setDefaultUserName: function (username) {
    if (!checkUsername(username)) {
      return;
    }
    $.post("/account/AjaxCheckUserName"
      , { userName: username }
      , function (r) {
        if (r.status == 1) {
          $("#eusername").val(username).addClass('fill');
        }
      });
  },
  bindExternal: function () {
    var _this = this;
    $.ajax({
      url: "/account/AjaxExternalBind",
      type: "post",
      data: { provider: this.externalProvider },
      success: function (r) {
        if (r.status != 1) {
          layer.aler(d.message);
        }
        else {
          var userName = $("#regAccount").val();
          if (userName.indexOf("@") > 0)
            _this.bindEmailSentCallback();
          else
            window.location = "/account/userprofile";
        }
      }
    })
  },
  bindEmailSentCallback: function () { }
}