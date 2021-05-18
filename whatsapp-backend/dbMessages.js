import mongoose from "mongoose";

//here we are going to define data schema
const whatsappSchema = mongoose.Schema({
	message: String,
	name: String,
	timestamp: String,
	received: Boolean,
});

export default mongoose.model("messagecontents", whatsappSchema);
