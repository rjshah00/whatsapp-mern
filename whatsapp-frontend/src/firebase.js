import firebase from "firebase";

//here add your firebaseconfig from your ptoject
const firebaseConfig = {
	apiKey: "AIzaSyBbYw4Uvd_5vZ9yUVGKhi5GwjUANovBogo",
	authDomain: "whatsapp-mern-94ad6.firebaseapp.com",
	projectId: "whatsapp-mern-94ad6",
	storageBucket: "whatsapp-mern-94ad6.appspot.com",
	messagingSenderId: "59252493994",
	appId: "1:59252493994:web:36f16e30722af557178ad3",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default db;
