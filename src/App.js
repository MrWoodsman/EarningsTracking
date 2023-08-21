import { useState } from "react";

import { EarningList } from "./components/EarningList/EarningList";
import { AddEarnings } from "./components/AddEarnings/AddEarnings";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { EarningProvider } from "./data/earningsContext";

import { StrictMode } from "react";
function App() {
	const [test, setTest] = useState([{ name: "1" }, { name: "2" }]);
	// ? Ta zmiena chyba musi być tu i udzielić dostęp dla komponentów
	// ? Ponieważ chce w kilku komponeentach korzystać z tego samego zestawu danych
	// ? I żeby w każdym się aktalizowało, tylko muszę znaleźć jak to wykonać

	return (
		// <StrictMode>
		<EarningProvider>
			<div className="App">
				<AddEarnings></AddEarnings>
				<SummaryCard type="all"></SummaryCard>
				<SummaryCard type="month"></SummaryCard>
				<SummaryCard type="week"></SummaryCard>
				<EarningList></EarningList>
			</div>
		</EarningProvider>
		// </StrictMode>
	);
}

export default App;
