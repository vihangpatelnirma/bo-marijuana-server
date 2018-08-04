function nullCheck(obj) {
	var flag = true

	for (var key in obj) {
		flag = flag && !!obj[key]
	}

	return flag
}

module.exports = {
	nullCheck,
}
