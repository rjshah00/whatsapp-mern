import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import axios from "./axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginComponent from "./LoginComponent";
import { useStateValue } from "./StateProvider";

function App() {
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		axios.get("/rooms/sync").then((response) => {
			setRooms(response.data);
		});
	}, []);
	useEffect(() => {
		const pusher = new Pusher("64332a0b8c2da2b804a9", {
			cluster: "ap2",
		});

		const channel = pusher.subscribe("messages");
		channel.bind("inserted", function (newMessage) {
			setMessages([...messages, newMessage]);
		});
		const channel_room = pusher.subscribe("rooms");
		channel_room.bind("inserted", function (newRoom) {
			setRooms([...rooms, newRoom]);
		});
		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			channel_room.unbind_all();
			channel_room.unsubscribe();
		};
	}, [messages, rooms]);
	const [{ user }] = useStateValue();

	return (
		<div className="app">
			{!user ? (
				<LoginComponent />
			) : (
				<div className="app__body">
					<Router>
						<Sidebar rooms={rooms} />
						<Switch>
							<Route path="/rooms/:roomId">
								{/* sidebar component */}
								{/* chat component */}
								<Chat messages={messages} />
							</Route>
							<Route path="/"></Route>
						</Switch>
					</Router>
				</div>
			)}
		</div>
	);
}

export default App;
