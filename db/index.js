let MongoClient = require("mongodb").MongoClient
let utils = require("./utils")
var mongodb = null

let uri = process.env.mongoCreds

if (process.env.ENV === "development") {
	let creds = require("../env")
	uri = creds.mongoCreds
}

function connectMongo() {
	// Connect to mongo db
	MongoClient.connect(
		uri,
		function(err, db) {
			console.log(db.collection)
			mongodb = db
		}
	)
}

function saveInDb(req, res) {
	var data = req.body

	var rowObject = {
		name: data.name,
		phone: data.phone,
		email: data.email,
		source: data.source,
		condition: data.condition,
		resident: data.resident,
		treatment: data.treatment,
		office: data.office,
		time: Math.floor(Date.now() / 1000), // Time of save the data in unix timestamp format
	}

	if (!utils.nullCheck(rowObject)) {
		console.log("Missing param from object : ", rowObject)
		res.send({
			success: false,
		})
		return
	}

	mongodb
		.collection("contacts")
		.insert(rowObject)
		.then(function(response) {
			console.log("success")
			res.send({
				success: true,
			})
		})
}

module.exports = {
	connectMongo: connectMongo,
	saveInDb: saveInDb,
}
