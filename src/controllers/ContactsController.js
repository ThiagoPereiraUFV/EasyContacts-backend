//  Loading database
const mongoose = require("mongoose");

//	Loading Contacts schema and collection from database
require("../models/Contact");
const contacts = mongoose.model("Contatos");

//	Exporting Contacts features
module.exports = {
	//	Return a specific contact given id from current user
	async index(req, res) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!contactId || !contactId.length || !mongoose.Types.ObjectId.isValid(contactId)) {
			return res.status(400).send("Invalid id!");
		}
		
		await contacts.findOne({ _id: contactId, userId }).then((contact) => {
			if(contact) {
				return res.status(200).json(contact);
			} else {
				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Create a new contact to current user
	async create(req, res) {
		const userId = req.headers.authorization;
		const { name, surname, phone, email, address, annotations } = req.body;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!name || !name.length ) {
			return res.status(400).send("Invalid name!");
		}

		await contacts.create({
			userId,
			name,
			surname,
			phone,
			email: email ? email.trim().toLowerCase() : email,
			address,
			annotations
		}).then((response) => {
			if(response) {
				return res.status(201).send("Contact created successfully!");
			} else {
				return res.status(400).send("We couldn't create a new contact, try again later!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Update a specific contact from current user
	async update(req, res) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;
		const { name, surname, phone, email, address, annotations } = req.body;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!contactId || !contactId.length || !mongoose.Types.ObjectId.isValid(contactId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!name || !name.length ) {
			return res.status(400).send("Invalid name!");
		}

		await contacts.findOneAndUpdate({ _id: contactId, userId }, {
			userId,
			name,
			surname,
			phone,
			email: email ? email.trim().toLowerCase() : email,
			address,
			annotations
		}).then((response) => {
			if(response) {
				return res.status(200).send("The contact have been updated!");
			} else {
				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Delete a specific contact from current user
	async delete(req, res) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!contactId || !contactId.length || !mongoose.Types.ObjectId.isValid(contactId)) {
			return res.status(400).send("Invalid id!");
		}

		await contacts.findOneAndDelete({ _id: contactId, userId }).then((response) => {
			if(response) {
				return res.status(200).send("The contact have been deleted!");
			} else {
				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Return all contacts from current user
	async all(req, res) {
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await contacts.find({ userId }).sort({
			name: "asc", 
			surname: "asc"
		}).then((response) => {
			if(response && response.length) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Contacts not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Return a list of contacts containing a specific word
	async search(req, res) {
		const userId = req.headers.authorization;
		const search_query = req.query.search_query;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await contacts.find({ 
			userId, 
			$or: [
				{
					name: {
						$regex: ".*" + search_query + ".*",
						$options: "i"
					}
				}, {
					surname: {
						$regex: ".*" + search_query + ".*",
						$options: "i"
					}
				}, {
					email: {
						$regex: ".*" + search_query + ".*",
						$options: "i"
					}
				}, {
					phone: {
						$regex: ".*" + search_query + ".*",
						$options: "i"
					}
				}, {
					annotations: {
						$regex: ".*" + search_query + ".*",
						$options: "i"
					}
				}
			]
		}).sort({ 
			name: "asc", 
			surname: "asc" 
		}).then((response) => {
			if(response && response.length) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Contacts not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
};