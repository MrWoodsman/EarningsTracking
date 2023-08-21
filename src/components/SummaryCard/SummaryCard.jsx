import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";

import "./SummaryCard.css";

export function SummaryCard(props) {
	const earnings = useEarnings();
	let now = new Date();

	const [selectedMonth, setSelectedMonth] = useState({
		month: String(now.getMonth() + 1).padStart(2, "0"),
		year: now.getFullYear(),
	});
	const [selectedWeek, setSelectedWeek] = useState({ week: 33, year: now.getFullYear() });

	function handleCalculateAll() {
		let sum = 0;
		earnings.map(el => {
			sum += Number(el.value);
		});
		return sum;
	}
	function handleCalculateMonth() {
		let sum = 0;
		earnings.forEach(el => {
			let [day, month, year] = el.date.split(".");
			if (year == selectedMonth.year) {
				if (month == selectedMonth.month) {
					sum += Number(el.value);
				}
			}
		});
		return sum;
	}
	function handleCalculateWeek() {
		let sum = 0;
		earnings.map(el => {
			// sum += Number(el.value);
		});
		return sum;
	}

	if (props.type === "all") {
		return (
			<div className="SummaryCard">
				<h4>Podsumowanie Ogólne</h4>
				<h2>{handleCalculateAll()} PLN</h2>
			</div>
		);
	}
	if (props.type === "month") {
		return (
			<div className="SummaryCard">
				<h4>Podsumowanie Miesięczne</h4>
				<h2>{handleCalculateMonth()} PLN</h2>
			</div>
		);
	}
	if (props.type === "week") {
		return (
			<div className="SummaryCard">
				<h4>Podsumowanie Tygodniowe</h4>
				<h2>{handleCalculateWeek()} PLN</h2>
			</div>
		);
	}
}
