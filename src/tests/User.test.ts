//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test file paths
const fileTest = ["./src/tests/files/test1.png", "./src/tests/files/test2.json"];

//	Test variables
var userToken = ["", ""];
const username = [Math.random().toString(36).substr(2, 9), Math.random().toString(36).substr(2, 9)];

describe("User", () => {
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Example",
			email: username[0] + "@example.com",
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken[0] = response.body.token);
	});

	test("Should be able to get created user", async () => {
		await request(app).get("/user").set({
			"x-access-token": userToken[0]
		}).expect(200);
	});

	test("Should be able to create another user", async () => {
		await request(app).post("/user").send({
			name: "User Example 2",
			email: username[1] + "@example.com",
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken[1] = response.body.token);
	});

	test("Should not be able to create a new user using existent email", async () => {
		await request(app).post("/user").send({
			name: "User Example",
			email: username[0] + "@example.com",
			password: "password",
			passwordC: "password"
		}).expect(400);
	});

	test("Should be able to get all users", async () => {
		await request(app).get("/allUsers").expect(200);
	});

	test("Should be able to update name and password of the first created user", async () => {
		await request(app).put("/user").set({
			"x-access-token": userToken[0]
		}).send({
			name: "User Updated Example",
			email: username[0] + ".updated@example.com",
			passwordO: "password",
			passwordN: "password1"
		}).expect(200);
	});

	test("Should be able to update image of the first created user", async () => {
		await request(app).put("/userImage").attach("image", fileTest[0]).set({
			"x-access-token": userToken[0]
		}).expect(200).then((response) => {
			return request(app).get("/files/" + response.body.image).expect(200);
		});
	});

	test("Should not be able to update image of the first created user", async () => {
		await request(app).put("/userImage").attach("image", fileTest[1]).set({
			"x-access-token": userToken[0]
		}).expect(400);
	});

	test("Should not be able to update email of the first created user using an existing email", async () => {
		await request(app).put("/user").set({
			"x-access-token": userToken[0]
		}).send({
			name: "User",
			email: username[1] + "@example.com"
		}).expect(400);
	});

	test("Should not be able to delete first created user using wrong password", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken[0],
			password: "password"
		}).expect(400);
	});

	test("Should be able to delete first created user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken[0],
			password: "password1"
		}).expect(200);
	});

	test("Should be able to delete second created user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken[1],
			password: "password"
		}).expect(200);
	});
});