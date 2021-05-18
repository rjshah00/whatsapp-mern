import { Avatar, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import "./Chat.css";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./axios.js";

function Chat({ messages }) {
	const [input, setInput] = useState("");
	const sendMessage = async (e) => {
		e.preventDefault();
		await axios.post("/message/new", {
			message: input,
			name: "Raj Shah",
			timestamp: "Just Now",
			received: false,
		});
		setInput("");
	};
	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar />
				<div className="chat__headerinfo">
					<h3>Room Nmae</h3>
					<p>last seen</p>
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
				{messages.map((message) => (
					<p
						className={`chat__message ${
							message.received ? "chat__receiver" : "chat__sender"
						}`}
					>
						<span className="chat__name">{message.name}</span>
						{message.message}
						<span className="chat__timestamp">
							{new Date().toUTCString()}
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
