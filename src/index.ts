//	Importing application resources
import app from "./app";

//	Defining port number
const PORT = process.env.PORT || 4000;

//	Listening requests on given port
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
}).on("error", (error) => {
	console.error(`Error on port:  ${PORT} \n`, error);
});
