//  Loading database and bcryptjs
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//	Loading Users and Contacts schemas and collections from database
require("../models/User");
require("../models/Contact");
const users = mongoose.model("Usuarios");
const contacts = mongoose.model("Contatos");

//	Defining regular expression to validations
const emailRegEx = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

//	Exporting User features
module.exports = {
	//	Return an user on database given id
	async index(req, res) {
		const userId = req.params.id;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await users.findById(userId).then((user) => {
			if(user) {
				return res.status(200).json(user);
			} else {
				return res.status(404).send("User not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Create a new user
	async create(req, res) {
		const { name, email, password, passwordC } = req.body;

		if(!name || !name.length) {
			return res.status(400).send("Invalid name!");
		}

		if(!email || !email.length || !emailRegEx.test(email)) {
			return res.status(400).send("Invalid email!");
		}

		if(!password || !password.length) {
			return res.status(400).send("Invalid password!");
		}

		if(!passwordC || !passwordC.length) {
			return res.status(400).send("Invalid password confirmation!");
		}

		if(password !== passwordC) {
			return res.status(400).send("The passwords don't match, try again!");
		}

		await users.findOne({ email: email.trim().toLowerCase() }).then((response) => {
			if(response) {
				return res.status(400).send("This email isn't available, try another!");
			} else {
				try {
					const salt = bcrypt.genSaltSync(10);
					const hash = bcrypt.hashSync(password, salt);

					users.create({
						name: email.trim(),
						email: email.trim().toLowerCase(),
						password: hash
					}).then((user) => {
						if(user) {
							return res.status(201).json(user);
						} else {
							return res.status(400).send("We couldn't process your request, try again later!");
						}
					}).catch((error) => {
						return res.status(500).send(error);
					});
				} catch(error) {
					return res.status(500).send(error.message);
				}
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Update current user on database
	async update(req, res) {
		const userId = req.headers.authorization;
		const { name, email, passwordO, passwordN } = req.body;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!name || !name.length) {
			return res.status(400).send("Invalid name!");
		}

		if(!email || !email.length || !emailRegEx.test(email)) {
			return res.status(400).send("Invalid email!");
		}

		await users.findById(userId).then((user) => {
			if(user) {
				var hash = "";

				if(passwordN && passwordN.length) {
					if(!bcrypt.compareSync(passwordO, user.password)) {
						return res.status(400).send("Old password don't match, try again!");
					}

					try {
						const salt = bcrypt.genSaltSync(10);
						hash = bcrypt.hashSync(passwordN, salt);
					} catch(error) {
						return res.status(500).send(error.message);
					}
				} else {
					hash = user.password;
				}

				user.name = name.trim();
				user.email = email.trim().toLowerCase();
				user.password = hash;

				user.save().then((response) => {
					if(response) {
						return res.status(200).json("Successful on updating your data!");
					} else {
						return res.status(400).send("We couldn't save your changes, try again later!");
					}
				}).catch((error) => {
					return res.status(500).send(error);
				});
			} else {
				return res.status(404).send("User not found!" );
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Remove current user from database giver correct user password
	async delete(req, res) {
		const { password } = req.body;
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!password || !password.length) {
			return res.status(400).send("Invalid password!");
		}

		await users.findById(userId).then((user) => {
			if(user) {
				bcrypt.compare(password, user.password).then((match) => {
					if(match) {
						contacts.deleteMany({ userId }).then(() => {
							user.remove().then(() => {
								return res.status(200).send("The user and all his contacts have been deleted!");
							}).catch((error) => {
								return res.status(500).send(error);
							});
						}).catch((error) => {
							return res.status(500).send(error);
						});
					} else {
						return res.status(400).send("Wrong password!");
					}
				});
			} else {
				return res.status(404).send("User not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	},
	//	Return all users
	async all(req, res) {
		await users.find().sort({
			name: "asc",
			creationDate: "desc"
		}).then((response) => {
			if(response && response.length) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Users not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
};