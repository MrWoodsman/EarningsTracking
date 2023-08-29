import { useEffect, useState } from "react";
import { Link, Switch, Route, Routes, Redirect, Navigate } from "react-router-dom";

import { EarningList } from "./components/EarningList/EarningList";
import { AddEarnings } from "./components/AddEarnings/AddEarnings";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { Login } from "./components/LoginForm/Login/Login";
import { Register } from "./components/LoginForm/Register/Register";

import { useNavigate, useLocation } from "react-router-dom";

import { useData, useDataDispatch, usePropertyValue } from "../src/data/dataContext";

import { db } from "../src/SupaBase/FireBaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useEarnings, useEarningsDispatch } from "../src/data/earningsContext";

function App() {
	const dispatch = useEarningsDispatch();
	const earnings = useEarnings();

	const UserDataDispatch = useDataDispatch();
	const UserData = useData();
	const navigate = useNavigate();
	const auth = getAuth();
	const shouldNavigate = usePropertyValue("shouldNavigate");

	const getAllData = async (db_id, user_uid) => {
		try {
			console.warn(user_uid);
			// Jesli uda sie znalezcz liste pobierz wszytstkie elementy
			const b = query(collection(db, `/users/${user_uid}/earningsList/${db_id}/list`));

			const querySnapshot = await getDocs(b);
			querySnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshots
				console.warn(doc.data().id);
				dispatch({
					type: "added",
					id: doc.data().id,
					title: doc.data().title,
					date: doc.data().date,
					value: Number(doc.data().value).toFixed(2),
				});
				console.log(doc.id, " => ", doc.data());
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleAuthStateChanged = async user => {
		if (user) {
			const uid = user.uid;

			if (shouldNavigate) {
				navigate("/EarningsTracking");
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: false });

				try {
					const q = query(collection(db, `/users/${uid}/earningsList`), where("id", "==", "0"));
					const querySnapshot = await getDocs(q);
					querySnapshot.forEach(doc => {
						console.log(doc.id, " => ", doc.data());
						getAllData(doc.id, uid);
					});
				} catch (error) {
					console.error(error);
				}
			}
		} else {
			if (shouldNavigate) {
				navigate("/EarningsTracking/login");
				UserDataDispatch({ type: "edited", nazwa: "shouldNavigate", wartosc: false });
			}
		}
	};

	onAuthStateChanged(auth, handleAuthStateChanged);

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
			<Routes>
				<Route
					path="/EarningsTracking"
					element={
						<div className="App">
							<button onClick={signOut}>Wyloguj</button>
							<AddEarnings />
							<SummaryCard type="all" />
							<SummaryCard type="month" />
							<SummaryCard type="week" />
							<EarningList />
						</div>
					}
				/>

				<Route path="/EarningsTracking/login" element={<Login />} />

				<Route path="/EarningsTracking/register" element={<Register />} />

				{/* Przekierowanie dla nieznalezionych ścieżek */}
				<Route path="*" element={<Navigate to="/EarningsTracking" />} />
			</Routes>
		</>
	);
}

export default App;
