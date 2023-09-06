import { useEffect, useState } from "react";

import "./App.css";

import { Link, Switch, Route, Routes, Redirect, Navigate } from "react-router-dom";

import { EarningList } from "./components/EarningList/EarningList";
import { AddEarnings } from "./components/AddEarnings/AddEarnings";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { Login } from "./components/LoginForm/Login/Login";
import { Register } from "./components/LoginForm/Register/Register";

import { Navbar } from "./components/Navbar/Navbar";

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
	const firstLoad = usePropertyValue("firstLoad");

	const isAuthenticated = usePropertyValue("isAuthenticated");
	// const [firstLoad, setFirstLoad] = useState(true);

	const getAllData = async (db_id, user_uid) => {
		dispatch({
			type: "clear",
		});
		try {
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

	// ? PODSTAWOWA MECHANIKA PO ZALOGOWANIU
	const [userDbData, setUserDbData] = useState(null);
	const [shouldAttachListener, setShouldAttachListener] = useState(true);

	useEffect(() => {
		if (shouldAttachListener) {
			const unsubscribe = onAuthStateChanged(auth, user => {
				if (user) {
					setUserDbData(user);
					UserDataDispatch({ type: "edited", nazwa: "isAuthenticated", wartosc: true });
				}
			});

			return () => {
				unsubscribe(); // Odpięcie nasłuchiwania przy odmontowaniu komponentu
			};
		}
	}, [auth, shouldAttachListener]);

	// ? Wywoływane każdorazowo przy zmianie [ testUser ]
	useEffect(() => {
		// Sprawdzanie czy zmienna jest ustawiona
		if (userDbData) {
			console.log(`Podstawowe ustawienia po zalogowaniu! User: ${userDbData.uid}`);
			UserDataDispatch({ type: "edited", nazwa: "isAuthenticated", wartosc: true });
			// navigate("/dashboard");
			// ? Funkcja pobierająca wszystkie zarobki z lsity użytkownika
			const startUp = async () => {
				try {
					const q = query(
						collection(db, `/users/${userDbData.uid}/earningsList`),
						where("id", "==", "0")
					);
					const querySnapshot = await getDocs(q);
					querySnapshot.forEach(doc => {
						console.log(doc.id, " => ", doc.data());
						getAllData(doc.id, userDbData.uid);
					});
				} catch (error) {
					console.error(error);
				}
			};
			startUp();
		} else {
			console.error(`Brak zalogowanego użytkownika!`);
			UserDataDispatch({ type: "edited", nazwa: "isAuthenticated", wartosc: false });
			// navigate("/login");
		}
	}, [userDbData]);

	function Dashboard() {
		return (
			<div className="App">
				<Navbar></Navbar>
				{/* <button
					style={{ padding: ".5rem 1rem", margin: ".5rem", marginBottom: "0" }}
					onClick={signOut}
				>
					Wyloguj
				</button> */}
				<AddEarnings />
				<div
					style={{ margin: "0px .5rem", gap: ".5rem", display: "flex", flexDirection: "column" }}
				>
					<SummaryCard type="all" />
					<SummaryCard type="month" />
					<SummaryCard type="week" />
				</div>
				<EarningList />
			</div>
		);
	}
	// ? Główny komponent
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
				/>

				<Route
					path="/EarningsTracking"
					element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
				/>

				<Route
					path="/dashboard"
					element={isAuthenticated ? <Dashboard></Dashboard> : <Navigate to="/login" />}
				/>

				<Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

				<Route
					path="/register"
					element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
				/>

				{/* Przekierowanie dla nieznalezionych ścieżek */}
				<Route
					path="*"
					element={
						<div
							style={{
								height: "100vh",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								gap: "1rem",
							}}
						>
							<h1>Nie znaleziono takiej strony!</h1>
							<Link to="/EarningsTracking">
								<button style={{ padding: ".5rem 1rem", cursor: "pointer" }}>
									Powrót do strony głównej
								</button>
							</Link>
						</div>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
