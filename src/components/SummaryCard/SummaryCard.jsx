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

	// ? Funkcje to obliczania tygodnia
	function getCurrentWeek() {
		const now = new Date();
		const dayOfWeek = now.getDay(); // 0 - niedziela, 1 - poniedziałek, ..., 6 - sobota

		// Jeśli dzisiaj jest niedziela (dayOfWeek === 0), to odejmujemy 6 dni od daty
		if (dayOfWeek === 0) {
			now.setDate(now.getDate() - 6);
		} else {
			now.setDate(now.getDate() - dayOfWeek + 1); // Ustawiamy na początek aktualnego tygodnia (poniedziałek)
		}

		const startOfYear = new Date(now.getFullYear(), 0, 1);
		const daysSinceStart = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
		const currentWeek = Math.ceil(daysSinceStart / 7);
		return currentWeek;
	}

	function isDateInWeek(selectedDate, weekString) {
		const parts = weekString.split("-W");
		if (parts.length === 2) {
			const year = parseInt(parts[0], 10);
			const targetWeek = parseInt(parts[1], 10);
			if (!isNaN(year) && !isNaN(targetWeek)) {
				const date = new Date(selectedDate);
				const dateYear = date.getFullYear();
				const dateWeek = getWeekNumber(date);

				return dateYear === year && dateWeek === targetWeek;
			}
		}
		return false;
	}

	function getWeekNumber(date) {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		d.setDate(d.getDate() + 4 - (d.getDay() || 7));
		const yearStart = new Date(d.getFullYear(), 0, 1);
		const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
		return weekNumber;
	}

	// ? TYDZIEN
	const [selectedWeek, setSelectedWeek] = useState(`${now.getFullYear()}-W${getCurrentWeek()}`);

	function handleCalculateWeek() {
		let sum = 0;
		earnings.map(el => {
			let changedDate = el.date.split(".").reverse().join("-");
			if (isDateInWeek(changedDate, selectedWeek)) {
				sum += Number(el.value);
			}
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
				<div className=""></div>
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
				<input type="week" value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} />
				<h2>{handleCalculateWeek()} PLN</h2>
			</div>
		);
	}
}
