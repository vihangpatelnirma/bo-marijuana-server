const express = require("express")
const app = express()
const db = require("./db")
const mailer = require("./mailer")
const bodyParser = require("body-parser")

const PORT = process.env.port || 8888

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
