import mongoose from "mongoose";

//here we are going to define data schema
const whatsappSchema = mongoose.Schema({
	message: String,
	name: String,
	timestamp: String,
	received: Boolean,
});

const roomSchema = mongoose.Schema({
	name: String,
	lastmsg: String,
});

const userSchema = mongoose.Schema({
	name: String,
	imageurl: String,
	password: String,
});

export const userDetails = mongoose.model("usercontent", userSchema);
export const roomDetails = mongoose.model("roomcontent", roomSchema);

export default mongoose.model("messagecontents", whatsappSchema);
