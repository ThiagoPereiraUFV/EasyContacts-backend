//  Importing express and mongoose resources
import { Request, Response } from "express";
import mongoose from "mongoose";

//	Importing Contacts repository
import ContactsRepository from "../repositories/ContactsRepository";

//	Importing helpers
import { deleteFile } from "../helpers/deleteFile";
import { contactUploads } from "../helpers/paths";

//	Contact features
class ContactsController {
	//	Return user contacts
	async index(req: Request, res: Response) {
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await ContactsRepository.allFromUser(userId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Contacts not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Create a new contact
	async create(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const { name, surname, phone, email, address, annotations } = req.body;

		await ContactsRepository.create({
			userId,
			name: name.trim(),
			surname: surname ? surname.trim() : null,
			phone: phone ? phone.trim() : null,
			email: email ? email.trim().toLowerCase() : null,
			address: address ? address.trim() : null,
			annotations: annotations ? annotations.trim() : null
		}).then((response) => {
			if(response) {
				return res.status(201).json(response);
			} else {
				return res.status(400).send("We couldn't create a new contact, try again later!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Update contact
	async update(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;
		const { name, surname, phone, email, address, annotations } = req.body;

		await ContactsRepository.update(contactId, <string>userId, {
			userId,
			name: name.trim(),
			surname: surname ? surname.trim() : null,
			phone: phone ? phone.trim() : null,
			email: email ? email.trim().toLowerCase() : null,
			address: address ? address.trim() : null,
			annotations: annotations ? annotations.trim() : null
		}).then((response) => {
			if(response) {
				return res.status(200).send("The contact have been updated!");
			} else {
				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Update contact image
	async updateImage(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;
		const filename = req?.file?.filename ?? "";

		await ContactsRepository.findById(<string>contactId, <string>userId).then((contact) => {
			if(contact) {
				const deleteImage = contact.image;
				contact.image = filename;

				contact.save().then((response) => {
					if(response) {
						if(deleteImage && deleteImage.length) {
							deleteFile(contactUploads(deleteImage));
						}

						return res.status(200).json(response);
					} else {
						deleteFile(contactUploads(filename));

						return res.status(400).send("Image could not be updated");
					}
				});
			} else {
				deleteFile(contactUploads(filename));

				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			deleteFile(contactUploads(filename));

			return res.status(500).send(error);
		});
	}

	//	Delete contact
	async delete(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const contactId = req.params.id;

		await ContactsRepository.delete(contactId, <string>userId).then((contact) => {
			if(contact) {
				if(contact.image && contact.image.length) {
					deleteFile(contactUploads(contact.image));
				}

				return res.status(200).send("The contact have been deleted!");
			} else {
				return res.status(404).send("Contact not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return all contacts
	async all(req: Request, res: Response) {
		await ContactsRepository.all().then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Contacts not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return a list of contacts containing a specific word
	async search(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const query = req.query.q;

		await ContactsRepository.find(<string>userId, <string>query).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Contacts not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
}

//	Exporting Contacts controller
export default new ContactsController();
