import React from "react";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import SidebarChat from "./SidebarChat.js";
import "./Sidebar.css";
import { useStateValue } from "./StateProvider";
function Sidebar({ rooms }) {
	const [{ user }] = useStateValue();

	return (
		<div className="sidebar">
			<div className="sidebar__header">
				<Avatar src={user?.photoURL} />
				<div className="sidebar__headerRight">
					<IconButton>
						<DonutLargeIcon />
					</IconButton>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>
			<div className="sidebar__search">
				<div className="sidebar__searchContainer">
					<SearchOutlinedIcon />
					<input placeholder="search or start a new chat" />
				</div>
			</div>
			<div className="sidebar__chats">
				<SidebarChat addnewChat />
				{rooms.map((room) => (
					<SidebarChat
						key={room._id}
						id={room._id}
						name={room.name}
						lastmsg={room.lastmsg}
					/>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
