import { Button } from "@material-ui/core";
import React from "react";
import "./LoginComponent.css";
import { auth, provider } from "./firebase";
import { actionType } from "./reducer";
import { useStateValue } from "./StateProvider";

function LoginComponent() {
	const [{}, dispatch] = useStateValue();
	const signIn = () => {
		auth.signInWithPopup(provider)
			.then((result) => {
				dispatch({
					type: actionType.SET_USER,
					user: result.user,
				});
				console.log(result);
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	return (
		<div className="login">
			<div className="login__container">
				<img
					src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
					alt=""
				/>
				<div className="login__text">
					<h1>Sign In to Whatsapp !!!</h1>
				</div>
				<Button type="submit" onClick={signIn}>
					Sign In with Google
				</Button>
			</div>
		</div>
	);
}

export default LoginComponent;
