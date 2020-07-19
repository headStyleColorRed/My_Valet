
const express = require("express")
const app = express();
const puerto = parseInt(process.env.PORT, 10) || 8889;
const bodyParser = require("body-parser")
const Cors = require("cors")
const mongoose = require("mongoose")
const environment = process.env.NODE_ENV
var dbLink = new String()

// Modules
const User = require("./mongoDB/userModel.js")

// Set environment
if (environment == "production")
	dbLink = "mongodb://user_DB:27017/mongouser"
else 
	dbLink = "mongodb://localhost:27017/mongouser"

// Middlewares
app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Routes
app.use("/user", require("./requests/userRequests"))
app.use("/parking", require("./requests/parkingRequest"))

// Open port
app.listen(puerto, () => console.log("Listening port " + puerto))


// DataBase connection
let timeOut = setInterval(() => {
	mongoose.connect(dbLink, { useNewUrlParser: true }, (err) => {
		if (err) {
			console.log("Encountered an error in Db Connection")
		} else {
			console.log("Succesfully connected with DB");
			clearInterval(timeOut)
			mongoose.set('useFindAndModify', false);
		}
	})
}, 5000);


// ++++++++++++++++ HTTP METHODS +++++++++++++++++++ //

app.get("/", (req, res) => {
	res.send("My-valet-user is up and running! :D")
})


app.get("/users", async (req, res) => {					//	 B O R R A R
	const users = await User.find();					//	 B O R R A R
	res.json(users);									//	 B O R R A R
});

app.get("/deleteUsers", async (req, res) => {			//	 B O R R A R
	const users = await User.deleteMany();				//	 B O R R A R
	res.json("Users deleted");							//	 B O R R A R
});



