import { useNavigate } from "react-router-dom";

import "./Login.css";

import { useData, useDataDispatch, usePropertyValue } from "../../../data/dataContext";
import { useState } from "react";

// toDo Zrobić logowanie za pomocą SupaBase { Email }
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function Login() {
	const navigate = useNavigate();
	const UserDataDispatch = useDataDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const auth = getAuth();
	function loginUser() {
		signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// Signed in
				const user = userCredential.user;
				console.warn(user);
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: true });
				// ...
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorMessage);
			});
	}

	return (
		<div className="LoginForm">
			<h2>Zaloguj się</h2>
			<div className="inputGroup">
				<label htmlFor="">E-mail</label>
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
			</div>
			<div className="inputGroup">
				<label htmlFor="">Hasło</label>
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
			</div>
			<div className="Flex1">
				<button className="Director" onClick={() => navigate("/EarningsTracking/register")}>
					Nie posiadam konta
				</button>
				<button className="Director">Zapomniałem hasła</button>
			</div>
			<button
				className="Button"
				// onClick={() => UserDataDispatch({ type: "edited", nazwa: "loged", wartosc: true })}
				onClick={() => loginUser()}
			>
				Zaloguj się
			</button>
		</div>
	);
}
