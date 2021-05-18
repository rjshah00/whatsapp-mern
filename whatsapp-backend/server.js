import express from "express";
import mongoose from "mongoose";
import Messages, { userDetails, roomDetails } from "./dbMessages.js";
import bodyparser from "body-parser";
import Pusher from "pusher";
import cors from "cors";

const db = mongoose.connection;
db.once("open", () => {
	console.log("db is connected");
	const msgCollection = db.collection("messagecontents");
	const userCollection = db.collection("usercontents");
	const roomCollection = db.collection("roomcontents");
	const changeStream_msg = msgCollection.watch();
	changeStream_msg.on("change", (change) => {
		console.log(change);
		if (change.operationType === "insert") {
			const messageDetails = change.fullDocument;
			pusher.trigger("messages", "inserted", {
				name: messageDetails.name,
				message: messageDetails.message,
				timestamp: messageDetails.timestamp,
				received: messageDetails.received,
			});
		} else {
			console.log("Error on trigerring pusher");
		}
	});
	const changeStream_user = userCollection.watch();
	changeStream_user.on("change", (change) => {
		console.log(change);
		if (change.operationType === "insert") {
			const userDetails = change.fullDocument;
			pusher.trigger("users", "inserted", {
				name: userDetails.name,
				email: userDetails.email,
				password: userDetails.password,
			});
		} else {
			console.log("Error on trigerring pusher");
		}
	});
	const changeStream_room = roomCollection.watch();
	changeStream_room.on("change", (change) => {
		console.log(change);
		if (change.operationType === "insert") {
			const roomDetails = change.fullDocument;
			pusher.trigger("rooms", "inserted", {
				name: roomDetails.name,
				lastmsg: roomDetails.lastmsg,
				messages: {
					message: "String",
					name: "String",
					timestamp: "String",
					received: "Boolean",
				},
			});
		} else {
			console.log("Error on trigerring pusher");
		}
	});
});

const app = express();
const port = process.env.PORT || 9000;
const connection_url =
	"mongodb://admin:MnFP9jpVezqESL6Y@cluster0-shard-00-00.ftorg.mongodb.net:27017,cluster0-shard-00-01.ftorg.mongodb.net:27017,cluster0-shard-00-02.ftorg.mongodb.net:27017/wtsapdb?ssl=true&replicaSet=atlas-vy5a7h-shard-0&authSource=admin&retryWrites=true&w=majority";

const pusher = new Pusher({
	appId: "1205458",
	key: "64332a0b8c2da2b804a9",
	secret: "4f42df27c3f16aad5e8c",
	cluster: "ap2",
	useTLS: true,
});

app.use(bodyparser.json());
app.use(cors());

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

app.get("/users/sync", (req, res) => {
	userDetails.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});
app.post("/user/new", (req, res) => {
	const dbUser = req.body;
	userDetails.create(dbUser, (err, data) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(201).send(`new message created \n ${data}`);
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

app.param("roomId", function (req, res, next, roomId) {
	req.roomId = roomId;
	next();
});

app.get("/messages/sync/:roomId", (req, res) => {
	Messages.find({ roomId: req.roomId }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.get("/rooms/sync", (req, res) => {
	roomDetails.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.post("/room/new", (req, res) => {
	console.log("hello");
	const dbRoom = req.body;
	console.log(dbRoom);
	roomDetails.create(dbRoom, (err, data) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(201).send(`new message created \n ${data}`);
		}
	});
});
