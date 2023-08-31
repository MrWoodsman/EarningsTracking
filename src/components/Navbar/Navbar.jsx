import React from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useData, useDataDispatch, usePropertyValue } from "../../data/dataContext";

import "./Navbar.css";

export function Navbar() {
	const auth = getAuth();

	const UserDataDispatch = useDataDispatch();

	// ? Funkcja odpowiedzialna za wylogowanie użytkownika
	function signOut() {
		auth
			.signOut()
			.then(() => {
				// Pomyślnie wylogowano użytkownika
				// navigate("/login");
				UserDataDispatch({ type: "edited", nazwa: "isAuthenticated", wartosc: false });
				console.log("Wylogowano!");
			})
			.catch(error => {
				// Obsłuż błąd wylogowania
				console.warn(error);
			});
	}

	return (
		<section className="navbar">
			<button onClick={signOut} className="navbar_logout">
				Wyloguj się
			</button>
		</section>
	);
}
