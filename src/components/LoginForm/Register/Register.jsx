import { useNavigate } from "react-router-dom";

import "./Register.css";
import { useEffect, useState } from "react";

import { useData, useDataDispatch, usePropertyValue } from "../../../data/dataContext";

import { db } from "../../../SupaBase/FireBaseClient";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export function Register() {
	const UserDataDispatch = useDataDispatch();

	const [email, setEmail] = useState(""); // Poprawione użycie hooków
	const [password, setPassword] = useState("");
	const [secondPassword, setSecondPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [samePasswords, setSamePasswords] = useState(false);
	const [passwordLenght, setPasswordLenght] = useState(false);
	const [emptyValue, setEmptyValue] = useState(true);

	const navigate = useNavigate();

	function CreateNewUser() {
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// Signed in
				const user = userCredential.user;
				// ...
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: true });
				console.warn(user);
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorMessage);
				// ..
			});
	}

	useEffect(() => {
		// ? Sprawdzanie długości hasła
		if (password.length >= 6) {
			setPasswordLenght(true);
		} else {
			setPasswordLenght(false);
		}
		// ? Sprawdzanie czy hasła są takie same
		if (password === secondPassword) {
			setSamePasswords(true);
		} else {
			setSamePasswords(false);
		}
		// ? Sprawdzanie czy żadne okienko nie jest puste
		setEmptyValue(false);
		if (email === "") {
			setEmptyValue(true);
		}
		if (password === "") {
			setEmptyValue(true);
		}
		if (secondPassword === "") {
			setEmptyValue(true);
		}
		// if (firstName === "") {
		// 	setEmptyValue(true);
		// }
		// if (lastName === "") {
		// 	setEmptyValue(true);
		// }
		if (samePasswords === false) {
			setEmptyValue(true);
		}
		if (passwordLenght === false) {
			setEmptyValue(true);
		}
	}, [email, password, secondPassword, firstName, lastName]);

	return (
		<div className="RegisterFrom">
			<div className="inputGroup">
				<h2>Utwórz konto</h2>
				<button className="Director" onClick={() => navigate("/EarningsTracking/login")}>
					Posiadasz konto?
				</button>
			</div>
			{/* <div className="inputGroup">
				<label htmlFor="">Imię</label>
				<input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
			</div>
			<div className="inputGroup">
				<label htmlFor="">Nazwisko</label>
				<input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
			</div> */}
			<div className="inputGroup">
				<label htmlFor="">E-mail</label>
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
			</div>
			<div className="inputGroup">
				<label htmlFor="">
					Hasło
					{samePasswords ? (
						<span className="ErrorText"></span>
					) : (
						<span className="ErrorText">- nie jest takie same</span>
					)}
					{passwordLenght ? (
						<span className="ErrorText"></span>
					) : (
						<span className="ErrorText">( min. 6 znaków. )</span>
					)}
				</label>
				<input
					type="password"
					className={samePasswords ? "" : "ErrorInput"}
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			<div className="inputGroup">
				<label htmlFor="">Potwierdz Hasło</label>
				<input
					className={samePasswords ? "" : "ErrorInput"}
					type="password"
					value={secondPassword}
					onChange={e => setSecondPassword(e.target.value)}
				/>
			</div>

			{/* <button className="Button" disabled={emptyValue} onClick={CreateNewUser}>
				Utwórz konto
			</button> */}
			<button className="Button" onClick={CreateNewUser}>
				Utwórz konto
			</button>
		</div>
	);
}
