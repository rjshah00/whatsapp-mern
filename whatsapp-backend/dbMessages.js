import mongoose from "mongoose";

// //here we are going to define data schema
const whatsappSchema = mongoose.Schema({
	message: String,
	name: String,
	timestamp: String,
	received: Boolean,
	roomId: {
		type: String,
		ref: "roomDetails",
	},
});

const roomSchema = mongoose.Schema({
	name: String,
	lastmsg: String,
});

const userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
});

export const roomDetails = mongoose.model("roomcontent", roomSchema);
export const userDetails = mongoose.model("usercontent", userSchema);
export default mongoose.model("messagecontent", whatsappSchema);
