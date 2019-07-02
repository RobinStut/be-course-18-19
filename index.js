const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const server = require("http").Server(app)
const path = require("path")
const rp = require("request-promise")
const cheerio = require("cheerio")
require("dotenv").config()
require("dotenv-json")()

const mongo = require("mongodb")

let db = null
const url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT

mongo.MongoClient.connect(url, { useNewUrlParser: true }, function(
	err,
	client
) {
	if (err) throw err
	db = client.db(process.env.DB_NAME)
	getFestivalData()
})

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(express.static(path.join(__dirname, "./static")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

async function getFestivalData(req, res, next) {
	const options = {
		uri: "https://festivalfans.nl/agenda/",
		transform: function(body) {
			return cheerio.load(body)
		}
	}
	checkUpdateStatus(options)
}

async function checkUpdateStatus(options) {
	const id = "5d19f56033c3becdcaf5f5e2"
	db.collection("festivalConfig")
		.find()
		.toArray(done)

	function done(err, data) {
		if (err) {
			next(err)
		} else {
			const lastUpdateTime = data[0].lastUpdate
			console.log(typeof lastUpdateTime)
			console.log(Date.now())
			const isRecentlyUpdated = lastUpdateTime < Date.now() + 86400000
			console.log(isRecentlyUpdated)
			if (isRecentlyUpdated === false) {
				console.log("data was outdated")
				updateFestivalData(options)
				updateConfigFile()
				console.log("data is updated now")
			} else {
				console.log("data is not updated")
			}
		}
	}
}

function updateFestivalData(options) {
	console.log("updating FestivalData")
	rp(options).then(function($) {
		$("div.ev2page")
			.children("script")
			.each(function(i, element) {
				const scriptTag = JSON.parse($(this).html())

				const rx = /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}).*/g

				let startDateObj
				const startDate = scriptTag.startDate.replace(rx, (...x) => {
					startDateObj = {
						year: x[1],
						month: x[2],
						day: x[3],
						hour: x[4]
					}
				})

				let endDateObj
				const endDate = scriptTag.endDate.replace(rx, (...x) => {
					endDateObj = {
						year: x[1],
						month: x[2],
						day: x[3],
						hour: x[4]
					}
				})

				const newdata = {
					name: scriptTag.name,
					plaats: scriptTag.location.address.addressLocality,
					adres: scriptTag.location.name,
					startDate: startDateObj,
					endDate: endDateObj,
					image: scriptTag.image
				}
				// console.log(newdata)
				add(newdata)
			})
	})
}

function updateConfigFile() {
	db.collection("festivalConfig").updateOne(
		{ name: "configFile" },
		{ $set: { lastUpdate: Date.now() } }
	)
}

function add(data) {
	db.collection(`festivalList`).insertOne(data, done)
	function done(err, data) {
		if (err) {
			next(err)
		} else {
		}
	}
}

require("./modules/routes.js")(app, mongo)

server.listen(process.env.PORT || 3000)
