const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const axios = require("axios")
const environment = process.env.NODE_ENV

const User = require("../mongoDB/userModel.js")
const ValidationManager = require("../tools/validation.js")
let userServer = ""

// Set environment
if (environment == "production")
	userServer = "user-server"
else 
	userServer = "localhost"


router.post("/register_user", async (req, res) => {
	// Parse request Data
	let body = req.body
	let isError = false

	let validation = ValidationManager.validateRegisterData(body)
	if (validation.isError) {
		res.status(200).send({ code: "200", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	// Encrypt and create user
	const hash = await bcrypt.hash(body.password, 10);
	const user = new User({email: body.email, username: body.username, password: hash, group: getGroup(body)});

	// Save user 
	await user.save().catch((err) => {
		if (err.code == 11000)
			res.status(200).send({ code: "400", status: "User already exists" })
		else 
			res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) { return }
	
	// Register user in User-server
	await axios.post(`http://${userServer}:8889/user/set-new-user`, body).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})

	if (isError) { return }

	res.status(200).send({ code: "200", status: "Register Succesfull"})

});


function getGroup(body) {
	if (body.group)
		if (body.group !== "")
			return body.group

	return "user"
}


module.exports = router;