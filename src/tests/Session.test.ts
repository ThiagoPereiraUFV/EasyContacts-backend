//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test variables
var userToken = "";

describe("Session", () => {
	beforeAll(async () => jest.setTimeout(30000));
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Session Example",
			email: "user.session@example.com",
			password: "password",
			passwordC: "password"
		}).then((response) => {
			expect(response.status).toBe(201);
			userToken = response.body.token;
		});
	});

	test("Should be able to create a session", async () => {
		await request(app).post("/session").send({
			email: "user.session@example.com",
			password: "password"
		}).set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(201);
			userToken = response.body.token;
		});
	});

	test("Should be able to get a session", async () => {
		await request(app).get("/session").set({
			"x-access-token": userToken
		}).then((response) => {
			expect(response.status).toBe(200);
		});
	});

	test("Should be able to delete user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken,
			password: "password"
		}).then((response) => {
			expect(response.status).toBe(200);
		});
	});
});