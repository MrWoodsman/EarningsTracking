import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";
import "./EarningList.css";

export function EarningList() {
	const dispatch = useEarningsDispatch();
	const earnings = useEarnings();

	function handleDelate(obj) {
		let dbId = obj.parentNode.parentNode.getAttribute("db_id");
		dispatch({
			type: "deleted",
			id: Number(dbId),
		});
	}

	if (earnings !== undefined) {
		return (
			<div className="EarningList">
				<h1>Lista zarobków:</h1>
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
										<button onClick={e => handleDelate(e.target)}>
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
