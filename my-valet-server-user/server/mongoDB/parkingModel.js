// Parking.model.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    isParkingTaken: {
        type: Boolean,
		default: false
	},
	userOccupant: {
		type: String,
		default: ""
	},
	parkingUsers: {
        type: Array
	}
	
});
const Parking = mongoose.model("Parking", userSchema);


module.exports = Parking;