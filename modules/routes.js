module.exports = app => {
	require("dotenv").config()
	const argon2 = require("argon2")
	const mongo = require("mongodb")
	const path = require("path")
	let db = null
	const url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT
	mongo.MongoClient.connect(url, { useNewUrlParser: true }, function(
		err,
		client
	) {
		if (err) throw err
		db = client.db(process.env.DB_NAME)
	})

	app.get("/", async (req, res) => {
		res.render("pages/index")
	})

	app.get("/account", async (req, res) => {
		res.render("pages/login")
	})

	app.get("/login", async (req, res) => {
		res.render("pages/login")
	})

	app.get("/signup", async (req, res) => {
		res.render("pages/signUp")
	})

	app.post("/login", async (req, res) => {
		const email = req.body.email
		const password = req.body.password
		db.collection("users").findOne(
			{
				email: email
			},
			done
		)

		async function done(err, data) {
			console.log(data)
			if (data === null) {
				res.render("pages/login", { msg: "email adres is onbekend" })
			} else {
				const dbPass = data.password
				const check = await argon2.verify(dbPass, password)
				// console.log(check)
				if (check) {
					console.log("succesvol ingelogd")
					req.session.user = data
					res.render("pages/login", {
						msg: `Hallo ${req.session.user.name}, je hebt succesvol ingelogd`,
						userData: req.session.user
					})
				}
				if (!check) {
					res.render("pages/login", { msg: "incorrect wachtwoord" })
				}
			}
		}
	})

	app.post("/aanmelden", async (req, res) => {
		const name = req.body.name
		const email = req.body.email
		const password = req.body.password
		const hashedPassword = await argon2.hash(password)
		const check = await argon2.verify(hashedPassword, password)
		console.log(`password is equal: ${check}`)
		add(name, email, hashedPassword)

		function add(name, email, password) {
			db.collection("users")
				.find()
				.toArray(done)

			function done(err, data) {
				if (err) {
					next(err)
				} else {
					function findEqualEmail(user) {
						return user.email === `${email}`
					}

					const doesItExist = data.find(findEqualEmail)
					console.log(doesItExist)
					if (doesItExist) {
						console.log("it does")
						res.render("pages/signUp", {
							msg: `het emailadres van ${email} is al in gebruik`
						})
					}
					if (doesItExist === undefined) {
						console.log("it does not")

						db.collection("users").insertOne(
							{ name: name, email: email, password: password },
							done
						)
						function done(err, data) {
							if (err) {
								next(err)
							} else {
								console.log("done")
								console.log(`${data.name}, ${data.email}`)
							}
						}

						res.render("pages/voorkeuren")
					}
				}
			}
		}

		// res.render("pages/quiz/quiz-result.ejs", {
		// 	quizResult: quizCombination,
		// 	hero: "hero--small",
		// 	heroText: ["Amsterdam", "Zuid-Oost", "Be a part of it!"]
		// })
	})
}
