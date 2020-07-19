const express = require("express")
const router = express.Router()

// Modules
const User = require("../mongoDB/userModel.js")
const Parking = require("../mongoDB/parkingModel.js")
const ValidationManager = require("../tools/validation.js")

router.post("/get_parking_data", async (req, res) => {
	let body = req.body
	let isError = false

	let parkingData = await Parking.findOne({ _id: body.parkingId }).catch((err) => {
		res.status(200).send({ code: "400", data: err })
		isError = true;
	})
	if (isError) return;

	res.status(200).send({ code: "200", data: parkingData })
});

router.post("/occupy_parking", async (req, res) => {
	let body = req.body
	let isError = false

	console.log(body);

	// Verify request data
	let validation = ValidationManager.validateUsernameData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	const filter = { _id: body.parkingId };
	const update = {
		isParkingTaken: true,
		userOccupant: body.username
	};

	await Parking.findOne(filter)
		.then((response) => {
			if (response.isParkingTaken) {
				res.status(200).send({ code: "400", status: "Parking already taken" })
				isError = true
			}
		}).catch((err) => {
			res.status(200).send({ code: "400", status: err })
			console.log(err);
			isError = true
		})
	if (isError) return;

	await Parking.findOneAndUpdate(filter, update).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		console.log(err);
		isError = true
	})
	if (isError) return;

	res.status(200).send({ code: "200", status: "Parking succesfully taken" })

});

router.post("/free_parking", async (req, res) => {
	let body = req.body
	let isError = false

	// Verify request data
	let validation = ValidationManager.validateUsernameData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	const filter = { _id: body.parkingId };
	const update = {
		isParkingTaken: false,
		userOccupant: ""
	};

	// Check if this user is occupying the parking spot and can free it
	await Parking.findOne({ _id: body.parkingId }).then((response) => {
		if (response.userOccupant != body.username) {
			res.status(200).send({ code: "400", status: "You cannot free this parking, only: " + response.userOccupant })
			isError = true
		}
	})
	.catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) return;

	// Free parking spot
	Parking.findOneAndUpdate(filter, update).catch((err) => {
		res.status(200).send({ code: "200", status: err })
		isError = true
	})
	if (isError) return;

	res.status(200).send({ code: "200", status: "Parking succesfully freed" })

});

router.post("/get_new_parking_spot", async (req, res) => {
	let body = req.body
	let isError = false

	// Verify request data
	let validation = ValidationManager.validateEmailData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;

	const parking = new Parking({ parkingStatus: false, parkingUsers: body.email })

	let parkingData = await parking.save().catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) return;

	const filter = { email: body.email };
	const update = { parkingSpot: `${parkingData._id}-` };

	await User.findOneAndUpdate(filter, update).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) return;

	res.status(200).send({ code: "200", status: parkingData._id })


});

router.post("/add_existing_parking_spot", async (req, res) => {
	let body = req.body
	let isError = false

	// Verify request data
	let validation = ValidationManager.validateEmailData(body)
	if (validation.isError) {
		res.status(200).send({ code: "400", status: validation.errorMessage })
		isError = true
	}
	if (isError) return;


	await Parking.findOne({ _id: body.parkingId }).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
	})
	if (isError) return;


	let filter = { email: body.email };
	let update = { parkingSpot: body.parkingId + "-" };

	await User.findOneAndUpdate(filter, update).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		console.log(err);
		isError = true
	})
	if (isError) return;

	res.status(200).send({ code: "200", status: "New parking added succesfully" })


});

module.exports = router;