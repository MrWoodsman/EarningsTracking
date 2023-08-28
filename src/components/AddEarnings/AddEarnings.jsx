import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";
import "./AddEarnings.css";

import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../SupaBase/FireBaseClient";

export function AddEarnings() {
	const dispatch = useEarningsDispatch();
	// const test = useEarnings();
	let now = new Date();

	const [name, setName] = useState();
	const [data, setData] = useState(
		`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
			now.getDate()
		).padStart(2, "0")}`
	);
	const [money, setMoney] = useState();

	const handleAddToDataBase = async (uid, ref) => {
		let getMoney = money;
		if (getMoney === undefined) {
			getMoney = 0;
		}
		const newDocRef = await addDoc(collection(db, `users/${uid}/earningsList/${ref}/list`), {
			id: Date.now(),
			title: name ? name : "Brak Nazwy",
			value: Number(getMoney).toFixed(2),
			date: data.split("-").reverse().join("."),
		});

		dispatch({
			type: "added",
			id: Date.now(),
			title: name ? name : "Brak Nazwy",
			date: data.split("-").reverse().join("."),
			value: Number(getMoney).toFixed(2),
		});
	};

	const handleAdd = async () => {
		const auth = getAuth();
		const user = auth.currentUser;
		console.warn(user.uid);

		// ? Szukanie listy o [ id ] = 0
		try {
			const q = query(collection(db, `/users/${user.uid}/earningsList`), where("id", "==", "0"));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(doc => {
				console.log(doc.id, " => ", doc.data());
				handleAddToDataBase(user.uid, doc.id);
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="AddNewEarningInput">
			<input
				type="text"
				onChange={e => setName(e.target.value)}
				placeholder="Nazwa"
				defaultValue={name}
			/>
			<input
				type="date"
				onChange={e => setData(e.target.value)}
				placeholder="Data"
				defaultValue={data}
			/>
			<input
				type="number"
				onChange={e => setMoney(e.target.value)}
				placeholder="Kwota"
				defaultValue={money}
			/>

			<button onClick={() => handleAdd()}>Dodaj Nowe</button>
		</div>
	);
}
