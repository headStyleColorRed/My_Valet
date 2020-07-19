const express = require("express")
const router = express.Router()

// Modules
const User = require("../mongoDB/userModel.js")
const ValidationManager = require("../tools/validation.js")

router.post("/set-new-user", async (req, res) => {
	let body = req.body
	let isError = false

	// Verify request data
	let validation = ValidationManager.validateUserData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	const user = new User({ email: body.email, username: body.username })

	// Save user and answer request
	await user.save().catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) return;

	res.status(200).send({ code: "200", status: "Registered new user" })
});

router.post("/get_user_info", async (req, res) => {
	let body = req.body
	let isError = false

	// Verify request data
	let validation = ValidationManager.validateEmailData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	// Find user and return user data
	await User.findOne({ email: body.email }).catch((err) => {
		res.status(200).send({ code: "400", status: err })
	}).then((response) => {
		res.status(200).send({ code: "200", status: response })
	})

});


module.exports = router;