module.exports = app => {
	require("dotenv").config()
	const argon2 = require("argon2")
	const mongo = require("mongodb")
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

	app.get("/signup", async (req, res) => {
		res.render("pages/signUp")
	})
	app.post("/aanmelden", async (req, res) => {
		const name = req.body.name
		const email = req.body.email
		console.log(`${name} & ${email}`)
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
						res.render("pages/alreadyExist", { email: email })
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
