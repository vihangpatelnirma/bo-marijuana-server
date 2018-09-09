const express = require("express")
const app = express()
const db = require("./db")
const mailer = require("./mailer")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const speakeasy = require("speakeasy")
const creds = require("./userCreds")

const PORT = process.env.PORT || 8888

// Add headers
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", ["http://localhost:3001", "https://bo-marijuana.herokuapp.com"])
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type")
	res.header("Access-Control-Allow-Credentials", true)
	next()
})

// Configure body parser
app.use(bodyParser.json())

// Configure cookie parser
app.use(cookieParser())

// connect mongo client
db.connectMongo()

// register URL
app.post("/save-in-db", function(req, res) {
	db.saveInDb(req, res)
	mailer.sendEmail(req, res)
})

const verifyToken = (secret, token) =>
	speakeasy.totp.verify({
		secret: secret.base32,
		encoding: "base32",
		token: token,
	})

const verifyCookie = userCookie => +userCookie % 23 === 0

const generateRandomNumber = () => {
	var randomNumber = Math.random().toString()
	return randomNumber.substring(5, randomNumber.length) * 23
}

app.post("/session/login", (req, res) => {
	const token = req.body.token
	const userName = req.body.userName

	// If user name is not found return
	if (!creds[userName]) {
		res.send({
			success: false,
			message: "Invalid Attempt",
		})
		return
	}

	// Verify token for that perticular user
	const verified = verifyToken(creds[userName], token)

	// set cookie in response
	res.cookie("USER", generateRandomNumber(), { maxAge: 1000 * 60 * 60 })

	res.send({
		success: Boolean(verified),
		message: !verified ? "Invalid credentials" : "You are logged in",
	})
})

app.post("/session/validate", (req, res) => {
	const sessionCookie = req.cookies.USER

	const isLoggedIn = verifyCookie(sessionCookie)
	if (isLoggedIn) {
		res.cookie("USER", generateRandomNumber(), { maxAge: 1000 * 60 * 60 })
		res.send({
			success: true,
		})
	} else {
		res.cookie("USER", "", { maxAge: 1 })
		res.send({
			success: false,
			message: "You are not logged in.",
		})
	}
})

app.listen(PORT, function() {
	console.log("app is listening at port number : ", PORT)
})
