//  Requiring database
import { Schema, Types, model } from "mongoose";
import { Contact } from "./interfaces/Contact";

//	Defining Contact schema
const ContactSchema = new Schema<Contact>({
	userId: {
		type: Types.ObjectId,
		ref: "Users",
		required: true
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	surname: {
		type: String,
		trim: true,
		required: false
	},
	phone: {
		type: String,
		trim: true,
		required: false
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: false
	},
	address: {
		type: String,
		trim: true,
		required: false
	},
	annotations: {
		type: String,
		trim: true,
		required: false
	},
	image: {
		type: String,
		required: false
	}
}, {
	timestamps: true
});

//	Creating collection Contacts on database if does not exist
export default model<Contact>("Contacts", ContactSchema);