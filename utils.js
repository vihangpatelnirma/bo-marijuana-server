const setCookie = (name, value, seconds) => {
	var expires = ""
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + seconds * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

module.exports = {
	setCookie,
}
