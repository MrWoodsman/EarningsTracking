import { useRef, useState } from "react";
import { useEarnings, useEarningsDispatch } from "../../data/earningsContext";

import "./SummaryCard.css";

export function SummaryCard(props) {
	const earnings = useEarnings();
	let now = new Date();

	// ? ROK
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const handleInputYear = event => {
		let newValue = event.target.value;
		if (newValue.length > 4) {
			newValue = newValue.slice(0, 4);
		}
		setSelectedYear(newValue);
	};
	// Podliczanie konkretnego roku
	function handleCalculateYear() {
		let sum = 0;
		earnings.map(el => {
			let [day, month, year] = el.date.split(".");
			if (year == selectedYear) {
				sum += Number(el.value);
			}
		});
		return sum;
	}

	// ? MIESIĄC
	const [selectedMonth, setSelectedMonth] = useState(
		`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
	);
	// Podliczanie konkretnego miesiaca
	function handleCalculateMonth() {
		let sum = 0;
		earnings.forEach(el => {
			let [selYear, selMonth] = String(selectedMonth).split("-");
			let [_, month, year] = el.date.split(".");
			if (year == selYear) {
				if (month == selMonth) {
					sum += Number(el.value);
				}
			}
		});
		return sum;
	}

	// ? TYDZIEN
	const [selectedWeek, setSelectedWeek] = useState({ week: 33, year: now.getFullYear() });

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
				<input
					type="number"
					placeholder="YYYY"
					min="2000"
					value={selectedYear}
					onChange={handleInputYear}
					max="2100"
					maxLength="4"
				/>
				<h2>{handleCalculateYear()} PLN</h2>
			</div>
		);
	}
	if (props.type === "month") {
		return (
			<div className="SummaryCard">
				<input
					type="month"
					value={selectedMonth}
					onChange={e => setSelectedMonth(e.target.value)}
				/>
				<h2>{handleCalculateMonth()} PLN</h2>
			</div>
		);
	}
	if (props.type === "week") {
		return (
			<div className="SummaryCard">
				<input type="week" />
				<h2>{handleCalculateWeek()} PLN</h2>
			</div>
		);
	}
}
