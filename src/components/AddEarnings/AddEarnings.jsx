import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";
import "./AddEarnings.css";

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

	function handleAdd() {
		let getMoney = money;

		if (getMoney === undefined) {
			getMoney = 0;
		}
		dispatch({
			type: "added",
			id: Date.now(),
			title: name ? name : "Brak Nazwy",
			date: data.split("-").reverse().join("."),
			value: Number(getMoney).toFixed(2),
		});
	}

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
