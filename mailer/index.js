const nodeMailer = require("nodeMailer")
let auth = {
	user: process.env.user,
	pass: process.env.pass,
}

if (process.env.ENV === "development") {
	const creds = require("../env")
	auth = {
		user: creds.auth.user,
		pass: creds.auth.pass,
	}
}

const transporter = nodeMailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // secure:true for port 465, secure:false for port 587
	auth,
})

function getMailOptions(params) {
	// setup email data with unicode symbols
	const mailOptions = {
		from: "nodevihang@gmail.com", // sender address
		to: params.email, // list of receivers
		subject: params.title, // Subject line
		text: params.body, // plain text body
	}

	return mailOptions
}

function sendEmail(req, res) {
	const reqParams = req.body.mailOptions

	if (reqParams) {
		const params = {
			email: reqParams.email,
			title: reqParams.title,
			body: reqParams.body,
		}

		if (!utils.nullCheck(params)) {
			console.log("Mail could not be saved, required params are missing ", params.email)
			return
		}

		transporter.sendMail(getMailOptions(params), handler)
	} else {
		console.log("Required mail options missing ")
	}
}

function handler(error, info) {
	if (error) {
		return console.log(error)
	}

	console.log("Message %s send : %s", info.messageId, info.respones)
	return true
}

module.exports = {
	sendEmail,
}
