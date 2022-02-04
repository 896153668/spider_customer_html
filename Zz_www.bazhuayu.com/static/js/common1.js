function switchToUrl(url, isParent) {
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