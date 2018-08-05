const express = require("express")
const app = express()
const db = require("./db")
const mailer = require("./mailer")
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 8888

// Add headers
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3001", "https://bo-marijuana.herokuapp.com"])
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
	res.setHeader("Access-Control-Allow-Credentials", true)
	next()
})

// Configure body parser
app.use(bodyParser.json())

// connect mongo client
db.connectMongo()

// register URL
app.post("/save-in-db", function(req, res) {
	db.saveInDb(req, res)
	mailer.sendEmail(req, res)
})

app.listen(PORT, function() {
	console.log("app is listening at port number : ", PORT)
})
