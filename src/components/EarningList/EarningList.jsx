import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";
import "./EarningList.css";

import { getAuth } from "firebase/auth";
import { db } from "../../SupaBase/FireBaseClient";
import { doc, deleteDoc, query, getDocs, collection, where } from "firebase/firestore";

export function EarningList() {
	const dispatch = useEarningsDispatch();
	const earnings = useEarnings();

	const handleDeleteFromDataBase = async (uid, ref, dbId) => {
		console.warn(uid, ref, dbId);
		const querySnapshot = await getDocs(
			query(
				collection(db, `/users/${uid}/earningsList/${ref}/list`),
				where("id", "==", Number(dbId))
			)
		);

		const deletePromises = [];

		querySnapshot.forEach(doc => {
			console.log(doc.id, " => ", doc.data());
			const deletePromise = deleteDoc(
				doc.ref // Pobieramy referencję do dokumentu i usuwamy go
			);
			deletePromises.push(deletePromise);
		});

		try {
			await Promise.all(deletePromises);
			console.warn("Deletion successful");
			// ? Usuwanie lokalnie
			dispatch({
				type: "deleted",
				id: Number(dbId),
			});
		} catch (error) {
			console.error("Error deleting documents:", error);
		}
	};

	async function handleDelate(obj) {
		const auth = getAuth();
		const user = auth.currentUser;
		let dbId = obj.parentNode.parentNode.getAttribute("db_id");
		// ? Usuwanie z bazy danych

		// ? Szukanie listy o [ id ] = 0
		try {
			const q = query(collection(db, `/users/${user.uid}/earningsList`), where("id", "==", "0"));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(doc => {
				console.log(doc.id, " => ", doc.data());
				handleDeleteFromDataBase(user.uid, doc.id, dbId);
			});
		} catch (error) {
			console.error(error);
		}
	}

	if (earnings !== undefined) {
		return (
			<div className="EarningList">
				<h2 className="EarningList_title">Lista zarobków</h2>
				<table>
					<tbody>
						<tr>
							<th>Nazwa</th>
							<th>Data</th>
							<th>Kwota</th>
							<th></th>
						</tr>
						{earnings.map((t, index) => {
							return (
								<tr key={index} db_id={t.id}>
									<td>{t.title}</td>
									<td>{t.date}</td>
									<td>{parseFloat(t.value).toFixed(2)} PLN</td>
									<td>
										<button className="delateButton" onClick={e => handleDelate(e.target)}>
											<i className="bi bi-trash-fill"></i>
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	} else {
		return (
			<div className="EarningList">
				<h1>Lista zarobków:</h1>
				<p>Brak dodanych zarobków!</p>
			</div>
		);
	}
}
