//  Importing mongoose resources
import { Document, Types } from "mongoose";

//	Defining Contact interface
export interface Contact extends Document {
	userId: Types.ObjectId,
	name: string,
	surname?: string,
	phone?: string,
	email?: string,
	address?: string,
	annotations?: string,
	image?: string,
	createdAt: Date,
	updatedAt: Date
};