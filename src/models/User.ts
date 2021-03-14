//  Importing mongoose, intefaces and bcrypt resources
import { Schema, model } from "mongoose";
import { User } from "./interfaces/User";
import bcrypt from "bcrypt";

//	Defining User schema
const UserSchema = new Schema<User>({
	name: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	password: {
		type: String,
		set: (p: String) => bcrypt.hashSync(p, bcrypt.genSaltSync(10)),
		required: true
	},
	image: {
		type: String,
		required: false
	}
}, {
	timestamps: true
});

UserSchema.methods.comparePassword = function(password: string) {
	if(password && password.length) {
			return bcrypt.compareSync(password, this.password);
	} else {
		return false;
	}
}

//	Creating collection Users on database if does not exist
export default model<User>("Users", UserSchema);