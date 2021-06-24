import contacts from "../models/Contact";

class ContactsRepository {
	public async create(contact: object) {
		return await contacts.create(contact);
	}

	public async findById(_id: string, userId: string) {
		return await contacts.findOne({ _id, userId });
	}

	public async allFromUser(userId: string) {
		return await contacts.find({ userId }).sort({
			name: "asc",
			surname: "asc"
		});
	}

	public async all() {
		return await contacts.find().populate("userId").sort({
			name: "asc",
			surname: "asc"
		});
	}

	public async find(userId: string, query: string) {
		return await contacts.find({
			userId,
			$or: [
				{
					name: {
						$regex: `.*${query}.*`,
						$options: "i"
					}
				}, {
					surname: {
						$regex: `.*${query}.*`,
						$options: "i"
					}
				}, {
					email: {
						$regex: `.*${query}.*`,
						$options: "i"
					}
				}, {
					phone: {
						$regex: `.*${query}.*`,
						$options: "i"
					}
				}, {
					annotations: {
						$regex: `.*${query}.*`,
						$options: "i"
					}
				}
			]
		}).sort({
			name: "asc",
			surname: "asc"
		});
	}

	public async update(_id: string, userId: string, contact: object) {
		return await contacts.findOneAndUpdate({ _id, userId }, contact);
	}

	public async delete(_id: string, userId: string) {
		return await contacts.findOneAndDelete({ _id, userId });
	}

	public async deleteAllFromUser(userId: string) {
		return await contacts.deleteMany({ userId });
	}

	public async deleteAll() {
		return await contacts.deleteMany();
	}
}

export default new ContactsRepository();
