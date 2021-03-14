import users from "../models/User";

class UsersRepository {
	public async findById(id: string) {
		return await users.findById(id);
	}

	public async findByEmail(email: string) {
		return await users.findOne({ email: email.trim().toLowerCase() });
	}

	public async create(user: object) {
		return await users.create(user);
	}

	public async all() {
		return await users.find().sort({
			name: "asc",
			creationDate: "desc"
		});
	}
}

export default new UsersRepository();