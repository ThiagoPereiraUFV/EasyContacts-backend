//	Imprting express, cors, path and routes resources
import express from "express";
import cors from "cors";
import path from "path";
import { routes } from "./routes";
import db from "./config/database";

class App {
	public express: express.Application;

	constructor() {
		this.express = express();

		this.database();
		this.middlewares();
		this.routes();
	}

	//	Using resources as middlewares
	private middlewares(): void {
		this.express.use(express.json());
		this.express.use(cors());
	}

	//	Implementing routes
	private routes(): void {
		this.express.use("/files", express.static(path.resolve(__dirname, "..", "public")));
		this.express.use(routes);
	}

	//	Connect to database
	private database(): void {
		db.connect();
	}
}

//	Exporting app object
export default new App().express;