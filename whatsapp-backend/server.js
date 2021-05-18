import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import bodyparser from "body-parser";
import Pusher from "pusher";

const db = mongoose.connection;
db.once("open", () => {
	console.log("db is connected");
	const msgCollection = db.collection("messagecontents");
	const changeStream = msgCollection.watch();
	changeStream.on("change", (change) => {
		console.log(change);
		if (change.operationType === "insert") {
			const messageDetails = change.fullDocument;
			pusher.trigger("messages", "inserted", {
				name: messageDetails.name,
				message: messageDetails.message,
			});
		} else {
			console.log("Error on trigerring pusher");
		}
	});
});

const app = express();
const port = 9000;
const connection_url =
	// "mongodb+srv://admin:MnFP9jpVezqESL6Y@cluster0.ftorg.mongodb.net/whatsappdb?retryWrites=true&w=majority";
	"mongodb://admin:MnFP9jpVezqESL6Y@cluster0-shard-00-00.ftorg.mongodb.net:27017,cluster0-shard-00-01.ftorg.mongodb.net:27017,cluster0-shard-00-02.ftorg.mongodb.net:27017/wtsapdb?ssl=true&replicaSet=atlas-vy5a7h-shard-0&authSource=admin&retryWrites=true&w=majority";

const pusher = new Pusher({
	appId: "1205458",
	key: "64332a0b8c2da2b804a9",
	secret: "4f42df27c3f16aad5e8c",
	cluster: "ap2",
	useTLS: true,
});

app.use(bodyparser.json());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Acces-Control-Allow-Headers", "*");
	next();
});
mongoose
	.connect(connection_url, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((data) => {
		app.listen(port, () => console.log(`listenning on post - ${port}`));
	})
	.catch((err) => {
		console.log(err);
	});

app.get("/", (req, res) => res.status(200).send("Hello Raj"));
app.get("/messages/sync", (req, res) => {
	Messages.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.post("/message/new", (req, res) => {
	const dbMessage = req.body;
	Messages.create(dbMessage, (err, data) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(201).send(`new message created \n ${data}`);
		}
	});
});

// {
//     "message":"hhdhweakjsbkdhjbfas",
//     "name" : "Raj SHah",
//     "timestamp": "EEWRERRRREWRREWREW",
//     "received":true
// }
