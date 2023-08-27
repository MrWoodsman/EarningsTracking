import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import { EarningList } from "./components/EarningList/EarningList";
import { AddEarnings } from "./components/AddEarnings/AddEarnings";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { Login } from "./components/LoginForm/Login/Login";
import { Register } from "./components/LoginForm/Register/Register";

import { useNavigate, useLocation } from "react-router-dom";

import { useData, useDataDispatch, usePropertyValue } from "../src/data/dataContext";

import { db } from "../src/SupaBase/FireBaseClient";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
	const UserDataDispatch = useDataDispatch();
	const UserData = useData();
	const navigate = useNavigate();
	const auth = getAuth();
	const shouldNavigate = usePropertyValue("shouldNavigate");
	onAuthStateChanged(auth, user => {
		if (user) {
			const uid = user.uid;
			console.warn(uid);

			// Sprawdź, czy użytkownik jest zalogowany i czy nastąpiła zmiana nawigacji
			if (shouldNavigate) {
				navigate("/EarningsTracking");
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: false });
			}
		} else {
			// Sprawdź, czy użytkownik jest wylogowany i czy nastąpiła zmiana nawigacji
			if (shouldNavigate) {
				navigate("/EarningsTracking/login");
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: false });
			}
		}
	});

	// ? Zmienne
	// const logdedValue = usePropertyValue("loged");
	// useEffect(() => {
	// 	if (test.pathname !== "/EarningsTracking") {
	// 		getLoggedUser();
	// 		if (logdedValue === true) {
	// 			navigate("/EarningsTracking");
	// 		} else if (logdedValue === false) {
	// 			navigate("/EarningsTracking/login");
	// 		}
	// 	}
	// 	// UserDataDispatch({ type: "edited", nazwa: "loged", wartosc: false });
	// }, [UserData]);
	// ? Ta zmiena chyba musi być tu i udzielić dostęp dla komponentów
	// ? Ponieważ chce w kilku komponeentach korzystać z tego samego zestawu danych
	// ? I żeby w każdym się aktalizowało, tylko muszę znaleźć jak to wykonać
	function signOut() {
		auth
			.signOut()
			.then(() => {
				// Pomyślnie wylogowano użytkownika
				navigate("/EarningsTracking/login");
			})
			.catch(error => {
				// Obsłuż błąd wylogowania
				console.warn(error);
			});
	}
	return (
		<>
			<button onClick={signOut}>Wyloguj</button>
			<Routes>
				<Route
					path="/EarningsTracking"
					element={
						<div className="App">
							<AddEarnings></AddEarnings>
							<SummaryCard type="all"></SummaryCard>
							<SummaryCard type="month"></SummaryCard>
							<SummaryCard type="week"></SummaryCard>
							<EarningList></EarningList>
						</div>
					}
				/>

				<Route path="/EarningsTracking/login" element={<Login></Login>} />

				<Route path="/EarningsTracking/register" element={<Register></Register>} />
			</Routes>
		</>
	);
}

export default App;
