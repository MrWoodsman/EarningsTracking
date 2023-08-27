import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Data providers
import { EarningProvider } from "./data/earningsContext";
import { DataProvider } from "./data/dataContext";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<BrowserRouter>
		<DataProvider>
			<EarningProvider>
				<App />
			</EarningProvider>
		</DataProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
