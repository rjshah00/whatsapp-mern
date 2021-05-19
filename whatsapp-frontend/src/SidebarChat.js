import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import axios from "./axios";
import { Link } from "react-router-dom";
function SidebarChat({ addnewChat, id, name }) {
	const [seed, setSeed] = useState("");
	const [lastmessage, setLastmessage] = useState("");
	const createChat = async (e) => {
		const roomName = prompt("Please enter a name for chat : ");
		if (roomName) {
			e.preventDefault();
			await axios.post("/room/new", {
				name: roomName,
				lastmsg: "",
			});
		}
	};
	useEffect(() => {
		if (id) {
			console.log(id);
			axios.get(`/messages/sync/desc/${id}`).then((response) => {
				if (response) {
					setLastmessage(response.data[0].message);
				} else {
					setLastmessage("");
				}
			});
		}
	}, [id]);
	useEffect(() => {
		setSeed(Math.floor(Math.random() * 5000));
	}, []);
	return !addnewChat ? (
		<Link to={`/rooms/${id}`}>
			<div className="sidebarChat">
				<Avatar
					src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
				/>
				<div className="sidebarChat__info">
					<h2>{name}</h2>
					<p>{lastmessage}</p>
				</div>
			</div>
		</Link>
	) : (
		<div onClick={createChat} className="sidebarChat">
			<h2>Add new chat</h2>
		</div>
	);
}

export default SidebarChat;
