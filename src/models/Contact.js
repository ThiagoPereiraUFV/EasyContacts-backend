//  Requiring database
const mongoose = require("mongoose");

//	Using schema feature from mongoose
const Schema = mongoose.Schema;

//	Defining Contact schema
const contactSchema = Schema({
	userId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	annotations: {
		type: String,
		required: false
	},
	imageName: {
		type: String,
		required: false
	},
	creationDate: {
		type: Date,
		default: Date.now()
	}
});

//	Creating collection Contatos on database
mongoose.model("Contatos", contactSchema);