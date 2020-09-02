//  Requiring database
const mongoose = require("mongoose");

//	Using schema feature from mongoose
const Schema = mongoose.Schema;

//	Defining User schema
const userSchema = Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now()
	}
});

//	Creating collection Usuarios on database
mongoose.model("Usuarios", userSchema);