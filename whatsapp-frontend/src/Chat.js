import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./axios.js";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Pusher from "pusher-js";

function Chat({ messages }) {
	const [seed, setSeed] = useState("");
	const { roomId } = useParams();
	const [roomName, setRoomName] = useState("");
	const [newMessages, setnewMessages] = useState([]);
	const [{ user }] = useStateValue();

	useEffect(() => {
		const unsubscribe = axios
			.get(`/messages/sync/${roomId}`)
			.then((response) => {
				setnewMessages(response.data);
			});
		setSeed(Math.floor(Math.random() * 5000));
		return unsubscribe;
	}, [roomId]);

	useEffect(() => {
		const pusher = new Pusher("64332a0b8c2da2b804a9", {
			cluster: "ap2",
		});

		const channel = pusher.subscribe("messages");
		channel.bind("inserted", function (newMessage) {
			setnewMessages([...newMessages, newMessage]);
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [messages, newMessages, roomId]);

	useEffect(() => {
		if (roomId) {
			axios.get("/rooms/sync").then((response) => {
				for (
					let index = 0;
					index < Object.keys(response.data).length;
					index++
				) {
					if (response.data[index]._id === roomId) {
						setRoomName(response.data[index].name);
						console.log(response.data[index].name);
					}
				}
			});
		}
		setRoomName("");
	}, [roomId]);

	const timestamp2 = new Date().toUTCString();
	const [input, setInput] = useState("");
	const sendMessage = async (e) => {
		e.preventDefault();
		await axios.post("/message/new", {
			message: input,
			name: user.displayName,
			timestamp: timestamp2,
			received: false,
			roomId: roomId,
		});
		setInput("");
	};

	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar
					src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
				/>
				<div className="chat__headerinfo">
					<h3>{roomName}</h3>
					<p>
						last seen at &nbsp;
						{newMessages[newMessages.length - 1]?.timestamp}
					</p>
				</div>
				<div className="chat__headerRight">
					<IconButton>
						<SearchOutlinedIcon />
					</IconButton>
					<IconButton>
						<AttachFileOutlinedIcon />
					</IconButton>
					<IconButton>
						<MoreVertOutlinedIcon />
					</IconButton>
				</div>
			</div>

			<div className="chat__body">
				{newMessages.map((message) => (
					<p
						className={`chat__message ${
							message.name === user.displayName &&
							"chat__receiver"
						}`}
					>
						<span className="chat__name">{message.name}</span>
						{message.message}
						<span className="chat__timestamp">
							{message.timestamp}
							{/* {new Date().toUTCString()} */}
						</span>
					</p>
				))}
			</div>
			<div className="chat__footer">
				<IconButton>
					<InsertEmoticonIcon />
				</IconButton>
				<form>
					<input
						placeholder="Type a message..."
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<button onClick={sendMessage} type="submit">
						Send a Message
					</button>
				</form>
				<MicIcon />
			</div>
		</div>
	);
}

export default Chat;
