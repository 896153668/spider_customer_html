// common
$(function(){
	agentRegisterHandling();
    agentOrderHandling();
	(function($){
		$('.nav-center li.dropdown').mouseover(function(){   
	    	$(this).addClass('open');    
	    }).mouseout(function() { 
	        $(this).removeClass('open');   
	    }); 
	})(jQuery);

	(function($){
	    function searchKeyword() {
	        var v = $('#searchText').val();
	        if (v) {
	            $.ajax({
	                url: "/Common/AjaxSearchKeyWord",
	                type: "post",
	                dataType: "json",
	                data: { "action": "search", "keyWord": v },
	                success: function (data) {

	                },
	                complete: function (XMLHttpRequest, textStatus) {
	                    window.location.href = '/search?query=' + encodeURI(v);//调用本次ajax请求时传递的options参数
	                }

	            });
	        }
	    }
	    $('#searchText').on('keyup', function () {
	    	var keycode = getKeyCode();  
	    	if(keycode == 13){
	    	    searchKeyword();
	    	}
	    });

	    $('#searchBtn').on('click', function () {
            searchKeyword();
        });

	})(jQuery);

	// backTop
	(function($){
		$(document).on('scroll',function(){
			var h = $(this).scrollTop(),
				w = $(window).height();
			if (h > w){
				$('.backtop .bt').show();
			}else{
				$('.backtop .bt').hide();
			}
		});

		$('.backtop .bt').on('click',function(){
			$('body,html').stop().animate({'scrollTop':'0'},200);
		});
		$('.slidetool-btn').on('mouseenter',function(){
			$(this).children('.slidetool').show();
		}).on('mouseleave',function(){
			$(this).children('.slidetool').hide();
		});
	})(jQuery);

	// down
	(function($){
		$('.zdbtn').on('click',function(){
			$(this).children('i').toggleClass('icon-angle-up');
			$(this).children('i').toggleClass('icon-angle-down');
			if($(this).children('i').hasClass('icon-angle-up')){
				$(this).siblings('.qqbox').children('.man').show();
			}else{
				$(this).siblings('.qqbox').children('.man').hide();
			}
			
		});

	})(jQuery);

	// search
	/*(function($){
		$('.tutorial-search .btn').on('click',function(){
			var val = $(this).siblings('input').val();
			if(val != ''){
				window.location.href = '/tutorial?type=0&page=0&tag='+val;
			}
		});

	})(jQuery);*/

	(function($){
		var u = getQueryString('tag');
		var type = getQueryString('type');
		$('.rmfl>div,#tagjj li').each(function(i,el){
			var y = $(el).children('a').attr('href').substr(1);
			var reg = new RegExp("(^|&)tag=([^&]*)(&|$)", "i"); 
			var a = y.match(reg);
			var regType = new RegExp("^type=([^&]*)(&|$)", "i"); 
			var eType=y.match(regType);
			if(a!=null && a.length>1 && a[2] == u && eType!=null && eType.length>0 && eType[1]==type){
				$(el).addClass('active').siblings('div').removeClass('active');
			}
		})

	})(jQuery);
	// pub function

	
	//注册分享链接
    function agentRegisterHandling() {
        var agentCode = getQueryString("AgentCode");
        if (!agentCode || agentCode == null || agentCode == "") {
            return;
        }
        var agent = $.cookie("AgentCode");
        if (agent) {
            $.cookie("AgentCode", null);
        }
        $.cookie("AgentCode", agentCode, { expires: 1, path: '/' });
        //alert(getCookie("AgentCode"));
    }
    //下单分享链接
    function agentOrderHandling() {
        var agentCode = getQueryString("AgentCode");
        //判断Url链接是否包含AgentCode，不包含直接退出
        if (!agentCode || agentCode == null || agentCode == "") {
            return;
        }
        var agent = $.cookie("AgentOrderCode");
        //判断当前客户端是否含有AgentCode，如果包含则判断和之前的是否一样，如果一样则继续更新时间
        if (agent) {
            if (agentCode == agent) {
                $.cookie("AgentOrderCode", null);
                $.cookie("AgentOrderCode", agentCode, { expires: 7, path: '/' });
            }
        } else {
            $.cookie("AgentOrderCode", agentCode, { expires: 7, path: '/' });
        }
        //alert(getCookie("AgentCode"));
    }
	// 拿到url参数的值
	function getQueryString(name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return decodeURI(r[2]); return null; 
	}


})

function switchToUrl(url,isParent) {
    if (Boolean(isParent) && window.parent) {
        window.parent.location = url;
    }
    else {
        window.location = url;
    }
}

function checkMobile(mobile) {
    if (!mobile)
        return false;
    return /(^1[3-9]{1})\d{9}$/.test(mobile);
}

function checkPassword(password) {
    if (!password)
        return false;
    return /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/.test(password);
}
function checkUsername(username) {
    if (!username)
        return false;
    return /(^[A-Za-z]{1}[A-Za-z0-9]{5,15}$)|(^[\u4E00-\u9FA5]{2,8}$)/.test(username);
}

function checkEmail(email) {
    if (!email)
        return false;
    return /^[\w-.]+@[\w-]+(.[\w_-]+)+$/.test(email);
}

function getKeyCode() {
    var event = arguments.callee.caller.arguments[0] || window.event
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    return keyCode;
}