//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test file paths
const fileTest = ["./src/tests/files/test1.png", "./src/tests/files/test2.json"];

//	Test variables
var userToken = "";
var contactId = ["", ""];

describe("Contact", () => {
	afterAll(async () => {
		await mongoose.connection.db.dropCollection("contacts").catch((error) => {
			return console.error("Unable to drop collection from database:", error);
		});
		await mongoose.connection.db.dropCollection("users").catch((error) => {
			return console.error("Unable to drop collection from database:", error);
		});
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Example",
			email: "user@example.com",
			password: "password",
			passwordC: "password"
		}).then((response) => {
			expect(response.status).toBe(201);
			userToken = response.body.token;
		});
	});

	test("Should be able to create a contact", async () => {
		await request(app).post("/contact").send({
			name: "Contact Example",
			email: "contact@example.com",
			phone: "4002-8922"
		}).set({
			"x-access-token": userToken
		}).then((response) => {
			contactId[0] = response.body._id;
			expect(response.status).toBe(201);
		});
	});

	test("Should be able to create another contact", async () => {
		await request(app).post("/contact").send({
			name: "Contact Example 2",
			email: "contact2@example.com",
			phone: "4002-8922"
		}).set({
			"x-access-token": userToken
		}).then((response) => {
			contactId[1] = response.body._id;
			expect(response.status).toBe(201);
		});
	});

	test("Should be able to get all user contacts", async () => {
		await request(app).get("/contact").set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(200);
			expect(response.body.length).toBe(2);
		});
	});

	test("Should be able to get all database contacts", async () => {
		await request(app).get("/allContacts").then((response) => {
			expect(response.status).toBe(200);
		});
	});

	test("Should be able to update name and email of the first created contact", async () => {
		await request(app).put("/contact/" + contactId[0]).send({
			name: "User",
			email: "user@example.com"
		}).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(200);
		});
	});

	test("Should be able to update image of the first created contact", async () => {
		await request(app).put("/contactImage/" + contactId[0]).attach("image", fileTest[0]).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(200);
		});
	});

	test("Should not be able to update image of the first created contact", async () => {
		await request(app).put("/contactImage/" + contactId[0]).attach("image", fileTest[1]).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(400);
		});
	});

	test("Should be able to delete first created contact", async () => {
		await request(app).delete("/contact/" + contactId[0]).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(200)
		});
	});

	test("Should not be able to update name and email of the first created contact", async () => {
		await request(app).put("/contact/" + contactId[0]).send({
			name: "User",
			email: "user@example.com"
		}).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(404);
		});
	});

	test("Should not be able to delete first created contact", async () => {
		await request(app).delete("/contact/" + contactId[0]).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(404)
		});
	});

	test("Should be able to delete user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken,
			password: "password"
		}).then((response) => {
			expect(response.status).toBe(200)
		});
	});

	test("Should not be able to get second created contact", async () => {
		await request(app).get("/contact/" + contactId[1]).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(404)
		});
	});

	test("Should be able to return 0 contacts", async () => {
		await request(app).get("/allContacts").then((response) => {
			expect(response.status).toBe(404)
		});
	});
});