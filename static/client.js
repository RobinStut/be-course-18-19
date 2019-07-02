console.log("working on it")

if (window.location.pathname == "/") {
	;(function() {
		let input, toUpper, festivalSection, festivalName, i, textValue
		input = document.getElementById("festivalSearchField")
		input.addEventListener(
			"keyup",
			e => {
				toUpper = input.value.toUpperCase()
				festivalSection = document.getElementsByTagName("label")
				for (i = 0; i < festivalSection.length; i++) {
					festivalName = festivalSection[i].getElementsByTagName("H3")[0]
					textValue = festivalName.textContent || festivalName.innerText
					if (textValue.toUpperCase().indexOf(toUpper) > -1) {
						festivalSection[i].style.display = ""
					} else {
						festivalSection[i].style.display = "none"
					}
				}
			},
			false
		)
	})()

	const festivalSelectionForm = document.getElementById("festivalSelectionForm")
	festivalSelectionForm.addEventListener("submit", async function(e) {
		e.preventDefault()
		let i
		let selectedFestivalArray = []
		for (i = 0; i < e.target.length; i++) {
			if (e.target[i].checked) {
				const idOfSelectedFestival = e.target[i].id
				selectedFestivalArray.push(idOfSelectedFestival)
			}
		}
		console.log(selectedFestivalArray)
		const clientId = "fakeName"
		const data = await fetch(
			`/updateFestivalPreferences/${clientId}/${selectedFestivalArray}`
		)
	})
}

if (window.location.pathname == "/login") {
	const loginForm = document.getElementById("loginForm")
	loginForm.addEventListener("submit", async function(e) {
		e.preventDefault()
		console.log(e)
		const emailValue = document.getElementById("email").value
		const passValue = document.getElementById("password").value
		console.log(`${emailValue} ${passValue}`)
	})
}

if (window.location.pathname == "/signUp") {
	repeatPassword.addEventListener("keyup", function(e) {
		const firstPassword = document.getElementById("password")
		const repeatPassword = document.getElementById("repeatPassword")
		const statusBar = document.getElementById("passwordStatus")
		const submitButton = document.getElementById("submit")
		const statusIs =
			firstPassword.value == repeatPassword.value
				? "correct" && submitButton.removeAttribute("disabled")
				: "false" && submitButton.setAttribute("disabled", true)
	})
}
