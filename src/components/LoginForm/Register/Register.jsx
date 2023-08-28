import { useNavigate } from "react-router-dom";

import "./Register.css";
import { useEffect, useState } from "react";

import { useData, useDataDispatch, usePropertyValue } from "../../../data/dataContext";

import { db } from "../../../SupaBase/FireBaseClient";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export function Register() {
	const UserDataDispatch = useDataDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");

	const [passwordLenght, setPasswordLenght] = useState(false);
	const [emptyValue, setEmptyValue] = useState(true);

	const [inputType, setInputType] = useState("password");
	const [errorMsg, setErrorMsg] = useState("");

	const navigate = useNavigate();

	function CreateNewUser() {
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// ? Jeśli uda się utworzyć konto
				const user = userCredential.user;
				// ? Tworzenie w bazie danych
				setDoc(doc(db, "cities", "LA"), {
					name: "Los Angeles",
					state: "CA",
					country: "USA",
				});
				// todo
				// ? Wysyłanie do danych ze jest możliwość zmiany ekranu
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: true });

				// ! DEV - wyświetlanie uzytkownika
				console.warn(user);
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;

				if (errorCode === "auth/email-already-in-use") {
					setErrorMsg("Email jest już w użyciu!");
				}
				// ! DEV - wyświetlanie kodu błędu
				console.warn(errorCode);
			});
	}

	useEffect(() => {
		// ? Sprawdzanie długości wpisanego hasła
		if (password.length >= 6) {
			setPasswordLenght(false);
		} else {
			setPasswordLenght(true);
		}

		// ? Sprawdzanie czy wszystkie pola są wypełnione
		setEmptyValue(false);
		if (email === "") {
			setEmptyValue(true);
		}
		if (password === "") {
			setEmptyValue(true);
		}
		if (firstName === "") {
			setEmptyValue(true);
		}
	}, [password, email, password, firstName]);
	// useEffect(() => {
	// 	// ? Sprawdzanie długości hasła
	// 	if (password.length >= 6) {
	// 		setPasswordLenght(true);
	// 	} else {
	// 		setPasswordLenght(false);
	// 	}
	// 	// ? Sprawdzanie czy hasła są takie same
	// 	if (password === secondPassword) {
	// 		setSamePasswords(true);
	// 	} else {
	// 		setSamePasswords(false);
	// 	}
	// 	// ? Sprawdzanie czy żadne okienko nie jest puste
	// 	setEmptyValue(false);
	// 	if (email === "") {
	// 		setEmptyValue(true);
	// 	}
	// 	if (password === "") {
	// 		setEmptyValue(true);
	// 	}
	// 	if (secondPassword === "") {
	// 		setEmptyValue(true);
	// 	}
	// 	// if (firstName === "") {
	// 	// 	setEmptyValue(true);
	// 	// }
	// 	// if (lastName === "") {
	// 	// 	setEmptyValue(true);
	// 	// }
	// 	if (samePasswords === false) {
	// 		setEmptyValue(true);
	// 	}
	// 	if (passwordLenght === false) {
	// 		setEmptyValue(true);
	// 	}
	// }, [email, password, secondPassword, firstName, lastName]);

	const conditionMet = emptyValue || passwordLenght;
	return (
		<section className="centredOnWeb">
			<section className="registerFormNew">
				<div className="flexColumn8">
					<h1>Zarządzaj lepiej swoimi finansami!</h1>
					<p>Dołącz, aby szybciej kontrolować swoje zarobki. Rejestracja to tylko chwila</p>
				</div>
				{errorMsg ? <p className="errorText">{errorMsg}</p> : ""}
				<div className="flexColumn8">
					<div className="inputBox">
						<i className="bi bi-person"></i>
						<input
							type="text"
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
							placeholder="Imię"
						/>
					</div>
					<div className="inputBox">
						<i className="bi bi-envelope"></i>
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="User@example.com"
						/>
					</div>
					<div className="inputBox">
						<i className="bi bi-lock"></i>
						<input
							type={inputType}
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Hasło"
						/>
						<i
							className="bi bi-eye iButton"
							onClick={e => {
								setInputType(prevInputType => (prevInputType === "password" ? "text" : "password"));
							}}
						></i>
						{/* <i class="bi bi-eye-slash"></i> */}
					</div>
				</div>
				<ul className="infoList">
					<li className={emptyValue ? "errorText" : ""}>Wszystkie pola wypełnione</li>
					<li className={passwordLenght ? "errorText" : ""}>Hasło co najmniej 6 znaków</li>
				</ul>
				<div className="flexColumn8">
					<button
						className="normalButton"
						onClick={CreateNewUser}
						disabled={conditionMet ? true : false}
					>
						Zarejestruj
					</button>
				</div>
				<div className="flexClumn8">
					<p style={{ textAlign: "center" }}>
						Posiadasz już konto?{" "}
						<button onClick={() => navigate("/EarningsTracking/login")} className="textButton">
							Zaloguj się
						</button>
					</p>
				</div>
			</section>
		</section>
		// <div className="RegisterFrom">
		// 	<div className="inputGroup">
		// 		<h2>Utwórz konto</h2>
		// 		<button className="Director" onClick={() => navigate("/EarningsTracking/login")}>
		// 			Posiadasz konto?
		// 		</button>
		// 	</div>
		// 	{/* <div className="inputGroup">
		// 		<label htmlFor="">Imię</label>
		// 		<input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
		// 	</div>
		// 	<div className="inputGroup">
		// 		<label htmlFor="">Nazwisko</label>
		// 		<input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
		// 	</div> */}
		// 	<div className="inputGroup">
		// 		<label htmlFor="">E-mail</label>
		// 		<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
		// 	</div>
		// 	<div className="inputGroup">
		// 		<label htmlFor="">
		// 			Hasło
		// 			{samePasswords ? (
		// 				<span className="ErrorText"></span>
		// 			) : (
		// 				<span className="ErrorText">- nie jest takie same</span>
		// 			)}
		// 			{passwordLenght ? (
		// 				<span className="ErrorText"></span>
		// 			) : (
		// 				<span className="ErrorText">( min. 6 znaków. )</span>
		// 			)}
		// 		</label>
		// 		<input
		// 			type="password"
		// 			className={samePasswords ? "" : "ErrorInput"}
		// 			value={password}
		// 			onChange={e => setPassword(e.target.value)}
		// 		/>
		// 	</div>
		// 	<div className="inputGroup">
		// 		<label htmlFor="">Potwierdz Hasło</label>
		// 		<input
		// 			className={samePasswords ? "" : "ErrorInput"}
		// 			type="password"
		// 			value={secondPassword}
		// 			onChange={e => setSecondPassword(e.target.value)}
		// 		/>
		// 	</div>

		// 	{/* <button className="Button" disabled={emptyValue} onClick={CreateNewUser}>
		// 		Utwórz konto
		// 	</button> */}
		// 	<button className="Button" onClick={CreateNewUser}>
		// 		Utwórz konto
		// 	</button>
		// </div>
	);
}
