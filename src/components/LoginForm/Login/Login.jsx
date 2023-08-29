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

	const [errorMsg, setErrorMsg] = useState("");

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
				console.warn(errorCode);
				if (errorCode === "auth/invalid-email") {
					setErrorMsg("Niepoprawny email!");
				}
				if (errorCode === "auth/missing-password") {
					setErrorMsg("Brak hasła!");
				}
				if (errorCode === "auth/wrong-password") {
					setErrorMsg("Błędne hasło!");
				}
				if (errorCode === "auth/user-not-found") {
					setErrorMsg("Brak użytkownika!");
				}
			});
	}

	return (
		<section className="centredOnWeb">
			<section className="loginFormNew">
				<div className="flexColumn8">
					<h1>Witamy ponownie!</h1>
					<p>Zacznij zarządzać swoimi zarobkami szybciej i lepiej</p>
				</div>
				{errorMsg ? <p className="errorText">{errorMsg}</p> : ""}
				<div className="flexColumn8">
					<div className="inputBox">
						<i className="bi bi-envelope"></i>
						<input
							name="loginEmail"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="User@example.com"
						/>
					</div>
					<div className="inputBox">
						<i className="bi bi-lock"></i>
						<input
							name="loginPassword"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Hasło"
						/>
					</div>
				</div>
				<div className="flexColumn8">
					<div className="alignRight">
						<button className="textButton">Zapomniałeś hasła?</button>
					</div>
					<button className="normalButton" onClick={() => loginUser()}>
						Zaloguj
					</button>
				</div>
				<div className="flexClumn8">
					<p style={{ textAlign: "center" }}>
						Nie masz konta?{" "}
						<button onClick={() => navigate("/EarningsTracking/register")} className="textButton">
							Zarejestruj się
						</button>
					</p>
				</div>
			</section>
		</section>
	);
}
